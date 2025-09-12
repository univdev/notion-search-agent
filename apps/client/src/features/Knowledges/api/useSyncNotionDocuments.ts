import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import syncDocumentsStream from '@/entities/NotionSyncronize/api/syncDocumentsStream';
import exportStreamMessageObject from '@/shared/stream/ExportStreamMessageObject';

export default function useSyncNotionDocuments() {
  const { t } = useTranslation('server-error.sync-notion-documents');
  const [isPending, setIsPending] = useState(false);
  const [syncDocumentsCount, setSyncDocumentsCount] = useState(0);

  const handle = () => {
    syncDocumentsStream().then((response) => {
      setIsPending(true);
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
            toast.error(t(data.error));
            return;
          }

          if (typeof data === 'object' && 'completedPageCount' in data) {
            setSyncDocumentsCount(data.completedPageCount);
          }
        }

        if (done) {
          setIsPending(false);
          return;
        }

        read();
      };

      read();
    });
  };

  return { handle, isPending, syncDocumentsCount } as const;
}
