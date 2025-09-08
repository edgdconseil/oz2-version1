
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/lovable-uploads/39be0dd5-afc9-47b6-865b-11cddf22500c.png';
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
