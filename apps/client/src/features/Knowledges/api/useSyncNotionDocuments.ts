import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { NOTION_SYNC_HISTORY_QUERY_KEY } from '@/shared/query-keys/NotionSyncHistoryQueryKey';

import useSyncNotionDocumentsMutation from './useSyncNotionDocumentsMutation';

export default function useSyncNotionDocuments() {
  const { t: serverErrorT } = useTranslation('server-error');
  const { t: chatT } = useTranslation('conversation');
  const { mutateAsync: syncNotionDocuments, isPending } = useSyncNotionDocumentsMutation();
  const queryClient = useQueryClient();

  const handler = () => {
    syncNotionDocuments()
      .then(() => toast(chatT('sync-notion-documents-success.message')))
      .catch((error) => {
        const isAxiosErr = isAxiosError(error);

        if (isAxiosErr) {
          const { response } = error;
          const errorData = response?.data;

          if ('error' in errorData && 'errorKey' in errorData.error) {
            const { errorKey } = errorData.error;
            toast.error(serverErrorT(`${errorKey}`));
          } else {
            toast.error(serverErrorT('sync-notion-documents.unknown-error'));
          }
        } else {
          toast.error(serverErrorT('sync-notion-documents.unknown-error'));
        }
      })
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: NOTION_SYNC_HISTORY_QUERY_KEY.all.queryKey });
      });
  };

  return [handler, isPending] as const;
}
