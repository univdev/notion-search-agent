import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './tailwind.css';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import ko from '../public/locales/ko/translation.json';
import en from '../public/locales/en/translation.json';
import { LOCALES, SUPPORT_LOCALES } from './shared/Configs/constants/Locales.constant';

i18n.use(initReactI18next).init({
  lng: LOCALES.lng,
  fallbackLng: LOCALES.fallbackLng,
  resources: {
    [SUPPORT_LOCALES.ko]: ko,
    [SUPPORT_LOCALES.en]: en,
  },
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NuqsAdapter>
      <App />
    </NuqsAdapter>
  </React.StrictMode>,
);
