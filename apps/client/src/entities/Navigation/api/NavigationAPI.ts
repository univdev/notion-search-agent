import axiosInstance from '@/shared/App/helpers/AxiosInstance';
import { ServerResponse } from '@/shared/App/types/Server.type';
import API_ROUTES from '@/shared/Configs/constants/APIRoutes.constant';

type NavigationChatHistory = {
  _id: string;
  summary: string;
};

export type GetNavigationChatHistoriesResponse = ServerResponse<
  NavigationChatHistory[],
  undefined,
  {
    offset: number;
    limit: number;
    loadedCount: number;
  }
>;

export type GetNavigationChatHistoriesParams = {
  offset: number;
  limit: number;
};

export const getNavigationChatHistories = (params: GetNavigationChatHistoriesParams) => {
  const { offset = 0, limit = 10 } = params || {};

  return axiosInstance.get<GetNavigationChatHistoriesResponse>(API_ROUTES.NAVIGATION.CONVERSATIONS, {
    params: {
      offset,
      limit,
    },
  });
};
