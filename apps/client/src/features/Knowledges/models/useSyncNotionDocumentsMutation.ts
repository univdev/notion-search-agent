import { useMutation } from '@tanstack/react-query';

import { syncNotionDatabase } from '@/entities/Notion/api/NotionAPI';

export default function useSyncNotionDocumentsMutation() {
  return useMutation({
    mutationFn: syncNotionDatabase,
    retry: false,
  });
}
