import { useInfiniteQuery } from '@tanstack/react-query';

import { NOTION_SYNC_HISTORY_QUERY_KEY } from '@/entities/NotionSyncronize/models/NotionSyncHistoryQueryKey';
import { getNotionSyncronizationHistories } from '@/entities/NotionSyncronize/models/NotionSyncronizeAPI';

export default function useNotionSyncHistoriesQuery() {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_OFFSET = 0;

  return useInfiniteQuery({
    queryKey: NOTION_SYNC_HISTORY_QUERY_KEY.all.queryKey,
    queryFn: ({ pageParam = DEFAULT_OFFSET }) =>
      getNotionSyncronizationHistories({ offset: pageParam, limit: DEFAULT_LIMIT }),
    getNextPageParam: (lastPage) => {
      const { loadedCount = 0, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = lastPage.data.pagination ?? {};

      return loadedCount < limit ? undefined : offset + limit;
    },
    select: (data) => data.pages.flatMap((page) => page.data.data),
    initialPageParam: 0,
  });
}
