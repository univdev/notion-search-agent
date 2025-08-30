import { LOCALES } from '../constants/Locales.constant';

export type Locales = (typeof LOCALES)[keyof typeof LOCALES];
