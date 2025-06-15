import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Early restore theme/font/contrast BEFORE React renders (in main.tsx)
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  if (savedTheme === 'dark') root.classList.add('dark');
  else if (savedTheme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } else {
    root.classList.remove('dark');
  }
}
const savedFont = localStorage.getItem('fontSize');
if (savedFont === 'large') root.classList.add('large-font');
else root.classList.remove('large-font');
const savedContrast = localStorage.getItem('contrast');
if (savedContrast === 'high') root.classList.add('high-contrast');
else root.classList.remove('high-contrast');

createRoot(document.getElementById("root")!).render(<App />);
