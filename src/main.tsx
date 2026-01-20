import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/globals.css';

// Add robots meta tag only in development mode
if (import.meta.env.DEV) {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.appendChild(meta);
}

// Reload the page after a hot reload
if (import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
    window.location.reload();
  });
}

// PROMPT 12 – REMOVE AFTER PROD VERIFICATION
if (import.meta.env.MODE === 'production') {
  console.info('✅ ReflectivAI Production Build: PROMPT-11');
}
console.info('🌐 Runtime Host:', window.location.hostname);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Handle GitHub Pages SPA redirect from 404.html
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  // Extract the path after the base path
  const basePath = '/dev_projects_full-build2';
  const path = redirect.replace(basePath, '') || '/';
  history.replaceState(null, '', basePath + path);
}

// Support both client-side navigation and SSR hydration
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
