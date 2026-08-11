import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/theme.css';

// รีเฟรชแล้วต้องกลับมาที่ซองเสมอ ไม่ให้เบราว์เซอร์คืนตำแหน่ง scroll เดิม (prd.md ตอน 1)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
