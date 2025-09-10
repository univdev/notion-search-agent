import { useMutation } from '@tanstack/react-query';

import { syncNotionDatabase } from '@/entities/NotionSyncronize/api/NotionSyncronizeAPI';

export default function useSyncNotionDocumentsMutation() {
  return useMutation({
    mutationFn: syncNotionDatabase,
    retry: false,
  });
}
