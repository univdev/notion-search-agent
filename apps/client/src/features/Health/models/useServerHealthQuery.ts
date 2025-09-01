import { useQuery } from '@tanstack/react-query';

import { getServerHealth } from '@/entities/Health/models/HealthAPI';
import { HEALTH_QUERY_KEY } from '@/entities/Health/models/HealthQueryKey';

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
