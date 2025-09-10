import { LOCALES } from './Locales';

export type Locales = (typeof LOCALES)[keyof typeof LOCALES];
