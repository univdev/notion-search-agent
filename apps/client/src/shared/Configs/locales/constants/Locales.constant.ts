export const SUPPORT_LOCALES = {
  ko: 'ko',
} as const;

export const LOCALES = {
  lng: SUPPORT_LOCALES.ko,
  fallbackLng: SUPPORT_LOCALES.ko,
} as const;
