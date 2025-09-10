import axiosInstance from '@/shared/api/AxiosInstance';
import { ServerResponse } from '@/shared/api/ServerResponseType';
import API_ROUTES from '@/shared/routes/APIRoutes';

export const syncNotionDatabase = () => {
  return axiosInstance.post(API_ROUTES.KNOWLEDGES.SYNC_NOTION_DOCUMENTS);
};

export const NOTION_SYNC_HISTORY_STATUS = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type NotionSyncHistory = {
  _id: string;
  status: (typeof NOTION_SYNC_HISTORY_STATUS)[keyof typeof NOTION_SYNC_HISTORY_STATUS];
  ip: string;
  totalPages: number;
  documents: {
    _id: string;
    title: string;
    url: string;
    createdAt: Date;
  }[];
  createdAt: Date;
};

export type GetNotionSyncronizationHistoriesParams = {
  offset: number;
  limit: number;
};

export type GetNotionSyncronizationHistoriesResponse = ServerResponse<
  NotionSyncHistory[],
  undefined,
  { offset: number; limit: number; loadedCount: number }
>;

export const getNotionSyncronizationHistories = (params: GetNotionSyncronizationHistoriesParams) => {
  return axiosInstance.get<GetNotionSyncronizationHistoriesResponse>(API_ROUTES.SYNC_HISTORIES.NOTION, {
    params: {
      ...params,
    },
  });
};
