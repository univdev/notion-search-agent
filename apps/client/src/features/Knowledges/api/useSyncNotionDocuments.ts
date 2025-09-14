import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import syncDocumentsStream from '@/entities/NotionSyncronize/api/syncDocumentsStream';
import { NOTION_SYNC_HISTORY_QUERY_KEY } from '@/shared/query-keys/NotionSyncHistoryQueryKey';
import exportStreamMessageObject from '@/shared/stream/ExportStreamMessageObject';

import useSyncNotionStreamStore from '../models/useSyncNotionStreamStore';

export default function useSyncNotionDocuments() {
  const { t: syncHistoryTranslation } = useTranslation('sync-history');
  const { t: errorTranslation } = useTranslation('server-error');
  const [setIsPending, setSyncDocumentsCount, clearStreamStore] = useSyncNotionStreamStore(
    useShallow((state) => [state.setIsPending, state.setSyncDocumentsCount, state.clear]),
  );
  const queryClient = useQueryClient();

  const handle = () => {
    setIsPending(true);
    syncDocumentsStream().then((response) => {
      queryClient.invalidateQueries({
        queryKey: NOTION_SYNC_HISTORY_QUERY_KEY.all.queryKey,
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return null;

      const read = async () => {
        const { done, value } = await reader.read();
        const data = decoder.decode(value, { stream: true });
        const messages = exportStreamMessageObject(data);

        for (const message of messages) {
          const { data } = message;

          if (typeof data === 'object' && 'error' in data) {
            setIsPending(false);
            clearStreamStore();
            clearCache();
            toast.error(errorTranslation(`sync-notion-documents.${data.error}`));
            return;
          }

          if (typeof data === 'object' && 'completedPageCount' in data) {
            setSyncDocumentsCount(data.completedPageCount);
          }
        }

        if (done) {
          setIsPending(false);
          toast.success(syncHistoryTranslation('completed-sync-notion-documents'));
          clearStreamStore();
          clearCache();
          return;
        }

        read();
      };

      read();
    });
  };

  function clearCache() {
    queryClient.invalidateQueries({
      queryKey: NOTION_SYNC_HISTORY_QUERY_KEY.all.queryKey,
    });
  }

  return handle;
}
