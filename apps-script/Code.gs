/**
 * Google Apps Script — หลังบ้านของเว็บ e-card
 *
 * รับ 2 อย่าง:
 *   1. คำอวยพร  → บันทึกลงชีต "Sheet1"
 *   2. สลิปของขวัญ → บันทึกไฟล์รูปลง Google Drive + เพิ่มแถวในชีต "Slips"
 *
 * วิธีติดตั้ง (ดู CLAUDE.md หัวข้อ "Backend: Google Sheet"):
 *  1. เปิด Google Sheet ที่จะใช้เก็บข้อมูล
 *  2. เมนู ส่วนขยาย (Extensions) → Apps Script
 *  3. ลบโค้ดเดิมทั้งหมด แล้ววางไฟล์นี้ลงไป
 *  4. Deploy → New deployment → เลือก type เป็น Web app
 *       - Execute as:      Me
 *       - Who has access:  Anyone      ← สำคัญมาก
 *         (ถ้าเลือก "Anyone with Google account" เว็บจะเรียกไม่ได้)
 *  5. ครั้งแรกจะขึ้นขออนุญาตเข้าถึง Google Drive → กดอนุญาต (ใช้เก็บไฟล์สลิป)
 *  6. คัดลอก Web app URL ที่ได้ ไปใส่ VITE_WISH_ENDPOINT
 *
 * หมายเหตุ: หลังแก้โค้ดทุกครั้ง ต้อง Deploy → Manage deployments → แก้เป็น New version
 * ไม่งั้น URL เดิมจะยังรันโค้ดเก่า
 */

var SHEET_WISHES = 'Sheet1';
var SHEET_SLIPS = 'Slips';
var DRIVE_FOLDER = 'DAWSUN Wedding - สลิปของขวัญ';

var HEADERS_WISHES = ['timestamp', 'name', 'message', 'userAgent'];
var HEADERS_SLIPS = ['timestamp', 'name', 'ลิงก์ไฟล์สลิป', 'ชื่อไฟล์'];

var MAX_NAME = 120;
var MAX_MESSAGE = 500;
/** ความยาว base64 สูงสุดที่ยอมรับ (~9 MB ของข้อมูลจริง) */
var MAX_IMAGE_B64 = 12 * 1024 * 1024;

/** หาชีตตามชื่อ ถ้าไม่มีก็สร้างพร้อมหัวคอลัมน์ */
function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** หาโฟลเดอร์เก็บสลิปใน Drive ถ้าไม่มีก็สร้างใหม่ */
function getSlipFolder_() {
  var it = DriveApp.getFoldersByName(DRIVE_FOLDER);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(DRIVE_FOLDER);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * ตัดอักขระควบคุมและจำกัดความยาว
 * validation ต้องมีฝั่งนี้ด้วย เพราะ endpoint เปิดสาธารณะ ห้ามพึ่ง client อย่างเดียว
 * คงไว้เฉพาะ \n (\x0A) และ \r (\x0D) เพื่อให้ข้อความหลายบรรทัดยังใช้ได้
 */
function clean_(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/** บันทึกคำอวยพร */
function handleWish_(data) {
  var name = clean_(data.name, MAX_NAME);
  var message = clean_(data.message, MAX_MESSAGE);
  if (!name || !message) return json_({ ok: false, error: 'invalid' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_(SHEET_WISHES, HEADERS_WISHES).appendRow([
      new Date(),
      name,
      message,
      clean_(data.userAgent, 300),
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

/** บันทึกสลิปของขวัญลง Drive แล้วเก็บลิงก์ไว้ในชีต */
function handleSlip_(data) {
  var b64 = typeof data.image === 'string' ? data.image : '';
  if (!b64) return json_({ ok: false, error: 'no-image' });
  if (b64.length > MAX_IMAGE_B64) return json_({ ok: false, error: 'too-large' });

  var mime = clean_(data.mime, 40) || 'image/jpeg';
  if (mime.indexOf('image/') !== 0) return json_({ ok: false, error: 'not-image' });

  var name = clean_(data.name, MAX_NAME) || 'ไม่ระบุชื่อ';
  var stamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss');
  var ext = mime === 'image/png' ? 'png' : 'jpg';
  var filename = stamp + ' ' + name + '.' + ext;

  var file;
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, filename);
    file = getSlipFolder_().createFile(blob);
  } catch (err) {
    return json_({ ok: false, error: 'save-failed: ' + String(err) });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_(SHEET_SLIPS, HEADERS_SLIPS).appendRow([
      new Date(),
      name,
      file.getUrl(),
      filename,
    ]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty' });
    }

    // เว็บส่งมาเป็น text/plain เพื่อเลี่ยง CORS preflight — จึงต้อง parse เอง
    var data = JSON.parse(e.postData.contents);

    // honeypot: ถ้ามีค่าแสดงว่าเป็นบอท ตอบ ok เพื่อไม่ให้รู้ตัว แต่ไม่บันทึก
    if (data.website && String(data.website).trim() !== '') {
      return json_({ ok: true });
    }

    if (data.type === 'slip') return handleSlip_(data);
    return handleWish_(data); // ไม่ระบุ type = คำอวยพร (เข้ากับเวอร์ชันเดิม)
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** เปิด URL ตรงๆ ในเบราว์เซอร์เพื่อเช็กว่า deploy สำเร็จ */
function doGet() {
  return json_({ ok: true, service: 'dawsun-wedding-guestbook' });
}
