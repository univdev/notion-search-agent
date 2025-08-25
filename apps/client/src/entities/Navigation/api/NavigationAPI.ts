import axiosInstance from '@/shared/App/helpers/AxiosInstance';
import { ServerResponse } from '@/shared/App/types/Server.type';
import API_ROUTES from '@/shared/Router/constants/APIRoutes.constant';

type NavigationChatHistory = {
  _id: string;
  summary: string;
};

export type GetNavigationChatHistoriesResponse = ServerResponse<NavigationChatHistory[], undefined, undefined>;

export const getNavigationChatHistories = () => {
  return axiosInstance.get<GetNavigationChatHistoriesResponse>(API_ROUTES.NAVIGATION.GET_CHAT_HISTORIES);
};
