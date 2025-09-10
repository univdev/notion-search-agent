import { useQuery } from '@tanstack/react-query';

import { getServerHealth } from '@/entities/Health/api/HealthAPI';
import { HEALTH_QUERY_KEY } from '@/shared/query-keys/HealthQueryKey';

export default function useServerHealthQuery() {
  return useQuery({
    queryKey: HEALTH_QUERY_KEY.all.queryKey,
    queryFn: getServerHealth,
    select: (res) => res.data,
    retry: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
  });
}
