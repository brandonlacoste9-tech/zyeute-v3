import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { GuestModeProvider } from './contexts/GuestModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
// import { NotificationProvider } from './contexts/NotificationContext'; // Uncomment if you have this

import { I18nProvider } from './locales/I18nContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
