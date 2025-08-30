import axiosInstance from '@/shared/App/helpers/AxiosInstance';
import API_ROUTES from '@/shared/Configs/constants/APIRoutes.constant';

export const syncNotionDatabase = () => {
  return axiosInstance.post(API_ROUTES.KNOWLEDGES.SYNC_NOTION_DOCUMENTS);
};
