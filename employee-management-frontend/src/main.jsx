import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {/* Keeping The App In The SEO */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
} catch (error) {
  console.error('React rendering error:', error);
  document.getElementById('root').innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
}
