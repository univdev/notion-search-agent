import { useMutation } from '@tanstack/react-query';

import { syncNotionDatabase } from '@/entities/NotionSyncronize/models/NotionSyncronizeAPI';

export default function useSyncNotionDocumentsMutation() {
  return useMutation({
    mutationFn: syncNotionDatabase,
    retry: false,
  });
}
