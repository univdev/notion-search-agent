import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './tailwind.css';
import ko from '../messages/ko.json';
import { LOCALES, SUPPORT_LOCALES } from './shared/Configs/locales/constants/Locales.constant';

i18n.use(initReactI18next).init({
  lng: LOCALES.lng,
  fallbackLng: LOCALES.fallbackLng,
  resources: {
    [SUPPORT_LOCALES.ko]: ko,
  },
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
