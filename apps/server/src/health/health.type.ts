import { HEALTH_STATUS } from './health.constant';

export type HealthStatus = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];
