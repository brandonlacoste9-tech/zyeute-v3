import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './components/AppProviders';

// MOUNT POINT for Zyeuté V1
// Refactored to use centralized AppProviders for correct context hydration order.
// This resolves potential Antigravity "Dynamic View" crashes.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
