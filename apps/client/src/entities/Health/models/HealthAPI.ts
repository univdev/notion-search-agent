import axiosInstance from '@/shared/App/helpers/AxiosInstance';
import API_ROUTES from '@/shared/Configs/constants/APIRoutes.constant';

export const SERVER_HEALTH = {
  UP: 'up',
  DOWN: 'down',
};

export const SERVER_HEALTH_STATUS = {
  OK: 'ok',
  ERROR: 'error',
} as const;

export type GetServerHealthResponse = {
  statusCode: number;
  data: {
    status: (typeof SERVER_HEALTH_STATUS)[keyof typeof SERVER_HEALTH_STATUS];
    info: Record<string, ServerHealth>;
    error: Record<string, ServerHealthDetail & { message?: string }>;
    details: Record<string, ServerHealthDetail>;
  };
};

export type GetServerHealthError = {
  timestamp: string;
  error: {
    status: (typeof SERVER_HEALTH_STATUS)[keyof typeof SERVER_HEALTH_STATUS];
    info: Record<string, ServerHealth>;
    error: Record<string, ServerHealthDetail & { message?: string }>;
    details: Record<string, ServerHealthDetail>;
  };
};

type ServerHealth = {
  status: (typeof SERVER_HEALTH)[keyof typeof SERVER_HEALTH];
};

type ServerHealthDetail = {
  status: (typeof SERVER_HEALTH)[keyof typeof SERVER_HEALTH];
  message: string;
};

export const getServerHealth = () => {
  return axiosInstance.get<GetServerHealthResponse>(API_ROUTES.HEALTH.CHECK);
};
