import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { StrictMode } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// Global error handler to catch and log errors
window.addEventListener('error', (event) => {
  console.error('=== GLOBAL ERROR CAUGHT ===')
  console.error('Error:', event.error);
  console.error('Message:', event.message);
  console.error('Stack:', event.error?.stack);
  console.error('==========================')
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===')
  console.error('Reason:', event.reason);
  console.error('===================================')
});

console.log('🚀 Starting app initialization... [Cache Buster: 2026-01-02T02:15:00Z]');
console.log('🔧 Environment check:', {
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found, rendering app...');
  
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('=== FAILED TO RENDER APP ===')
  console.error('Error:', error);
  console.error('============================')
  
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: monospace; max-width: 800px; margin: 0 auto;">
      <h1 style="color: red;">Application Failed to Start</h1>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h3>Error Message:</h3>
        <pre style="color: red; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <h3 style="margin-top: 20px;">Stack Trace:</h3>
        <pre style="overflow: auto; font-size: 12px;">${error instanceof Error ? error.stack : ''}</pre>
      </div>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}
