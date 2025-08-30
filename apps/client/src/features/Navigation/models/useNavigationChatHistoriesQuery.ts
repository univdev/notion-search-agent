import { useQuery } from '@tanstack/react-query';

import { getNavigationChatHistories } from '@/entities/Navigation/api/NavigationAPI';
import { NAVIGATION_QUERY_KEY } from '@/entities/Navigation/models/NavigationQueryKey';

export const useNavigationConversationsQuery = () => {
  return useQuery({
    queryKey: NAVIGATION_QUERY_KEY.conversations.queryKey,
    queryFn: getNavigationChatHistories,
    select: (data) => data.data,
  });
};
