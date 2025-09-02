import { useInfiniteQuery } from '@tanstack/react-query';

import { getNavigationChatHistories } from '@/entities/Navigation/api/NavigationAPI';
import { NAVIGATION_QUERY_KEY } from '@/entities/Navigation/models/NavigationQueryKey';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

export const useNavigationConversationsQuery = () => {
  return useInfiniteQuery({
    queryKey: NAVIGATION_QUERY_KEY.conversations.queryKey,
    queryFn: ({ pageParam = DEFAULT_OFFSET }) =>
      getNavigationChatHistories({ offset: pageParam, limit: DEFAULT_LIMIT }),
    getNextPageParam: (lastPage) => {
      const limit = lastPage.data.pagination?.limit ?? DEFAULT_LIMIT;
      const offset = lastPage.data.pagination?.offset ?? DEFAULT_OFFSET;
      const loadedCount = lastPage.data.pagination?.loadedCount ?? 0;

      return loadedCount < limit ? undefined : offset + limit;
    },
    select: (response) => response.pages.map((response) => response.data.data),
    initialPageParam: 0,
  });
};
