import { useQuery } from '@tanstack/react-query';

import { getNavigationChatHistories } from './NavigationAPI';
import { NAVIGATION_QUERY_KEY } from './NavigationQueryKey';

export const useNavigationChatHistoriesQuery = () => {
  return useQuery({
    queryKey: NAVIGATION_QUERY_KEY.chatHistories.queryKey,
    queryFn: getNavigationChatHistories,
    select: (data) => data.data,
  });
};
