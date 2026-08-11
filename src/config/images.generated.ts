/**
 * ไฟล์นี้สร้างอัตโนมัติจาก `npm run optimize` — อย่าแก้ด้วยมือ
 * ต้นฉบับ: รูปจริง/รูปเจ้าบ่าว เจ้าสาว/
 */
export type GeneratedImage = {
  src: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  blur: string;
};

export const generatedImages: GeneratedImage[] = [
  {
    "src": "couple-01.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAACQBACdASoQABgAPxFysFAsJqSisAgBgCIJYwCdACILm87DRgeVD34BHdd3jYAAzjLPQ0NQiQ/bftgv8VcXC/mYtqJHp/i6qmi6xKeDBRSIgynOyLp+HU/JWWgrAJvNv4Ble82yVs3gHXmp+E5FeEfmv7+vnA76zTaABnLVagcEbinqMj8jhAyd038itkH5qG/q3JAA"
  },
  {
    "src": "couple-02.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAADwAwCdASoQABgAPxFysFAsJqSisAgBgCIJZwDLLCHhUBCB0yCNlKLAAP6MHvY6u52T06SC5Fgm4MuoViB136/ZchNT6CEPhTdym4iRONf3kc0UPIKNDAY3sXhbeXYJZp071/ZI2ol/Dvk7H56vNYlnp3AQAAAA"
  },
  {
    "src": "couple-03.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAwCdASoQABgAPxFysVCsJqSisAgBgCIJZwDDNCHEJylRAH58vBkgAP4OfGtyg4I8KI9d8EV4ICrpGX0ZQTqA6a46JGe/WF0+FHG6nhMRp07fui+Po7pyHh+DdTUF449oSIM4n+AAAA=="
  },
  {
    "src": "couple-04.webp",
    "width": 1567,
    "height": 1045,
    "orientation": "landscape",
    "blur": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAsABABoJZwC7ABshT1AgAD+cPVGOOPrBn3KJMs7zvbu3bLR+rd5petAql4DQXZHOHTOXyyIAAAA"
  },
  {
    "src": "couple-05.webp",
    "width": 1567,
    "height": 1045,
    "orientation": "landscape",
    "blur": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAQCdASoQAAsABABoJQBOgMXSsTGYHzQA+U9SsEXfVax2Rlnxt3If4NeoAxav6/gcWLNmiijzF94rwk0nUYS42RuDXwGl0UO6H+Aub78G0ctcNBxBlb80IUHYAAAA"
  },
  {
    "src": "couple-06.webp",
    "width": 1030,
    "height": 1588,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADwAwCdASoQABkAPxFyslCsJqSisAgBgCIJZwDE2CFnmczT5uEs44gQAP4QtxKWZw64yCbCYtkjDXsV7tRrvm40Aao0p7QD67eX//JXaYKgf2nqqY24OMb6JYn8h43Q0A6w1yaQYCkxgAAA"
  },
  {
    "src": "couple-07.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAAAwBACdASoQABgAPxFysFAsJqSisAgBgCIJYwC06B+B48y5frW/OSvDljAA/SEgd6lNdo4z0dhnBracgK3NR4WRCR/8czpF2h6HWxN/hcEzJgDdWU8PdaMEOe6xV4xzYA4AuEabq6LAVhn1+FqstzumqX138ReNKKNjVIm7cX0HQEV6VI8eUfiIYqgAAA=="
  },
  {
    "src": "couple-08.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQBACdASoQABgAPxFysVAsJqSisAgBgCIJZQAAPd6eY8VZ2kPqmyqjAAD9CovLr00sfy5VnHJ0oT3MLVd1I3QsdO9Bo51IYKBp0M+fpeInyIAIRNlpEKWwcWbf9YYq40OYnDpoV6gAAA=="
  },
  {
    "src": "couple-09.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABwBACdASoQABgAPxFysFAsJqSisAgBgCIJQBOgO4AgbJWDjioOq4EqYU/TAAD9b5fN2VEz+4tvKs1ktEljhjy5t/ftOMMdlnwPgpqJi1gFEs1iEPb42B2R6blRVs8ZG28LZ9MfPMDHCXWL5Xx0Mdk1l4VD218798M+tdey0DPIRemH4r1MKDVeQOT8uUcNjgA="
  },
  {
    "src": "couple-10.webp",
    "width": 1045,
    "height": 1567,
    "orientation": "portrait",
    "blur": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAwBACdASoQABgAPxFysFAsJqSisAgBgCIJZQDCgYxiubHg5E0f8acMF4AAzjLPKpA+xTp3IcnPAwnupNWPoI222K0KxitDYCqjyQM+RFah7yPsIZfEtB0U3xZwlneOLzq0sXhSlocPIWYSJprMGzyEAR+k7kB4KzMy9AWLf2fBjPhX23zhXRS8+9dNxfYiNo/FJ63KPNgAAA=="
  }
];
