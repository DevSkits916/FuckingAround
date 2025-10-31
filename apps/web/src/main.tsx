import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { I18nProvider } from './i18n';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root container missing');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              document.dispatchEvent(new CustomEvent('ssb:update-ready'));
            }
          });
        });
      })
      .catch((error) => console.warn('SW registration failed', error));
  });
}

