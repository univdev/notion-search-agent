import { Health } from './health';

export type HealthStatus = (typeof Health.STATUS)[keyof typeof Health.STATUS];
