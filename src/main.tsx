
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './i18n' // Import i18n configuration

// Log message for mapbox token
console.log('Note: To enable maps functionality, you need to provide a Mapbox token. Get one at https://mapbox.com');

// Get the base path from the current location
const getBasename = () => {
  // In production with GitHub Pages, use the base path
  if (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/skidqi-kz')) {
    return '/skidqi-kz';
  }
  // For development or other deployments, use root
  return '';
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={getBasename()}>
    <App />
  </BrowserRouter>
);
