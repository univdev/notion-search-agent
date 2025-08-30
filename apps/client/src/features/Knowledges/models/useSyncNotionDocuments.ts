import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import useSyncNotionDocumentsMutation from './useSyncNotionDocumentsMutation';

export default function useSyncNotionDocuments() {
  const { t: serverErrorT } = useTranslation('server-error');
  const { t: chatT } = useTranslation('chat');
  const { mutateAsync: syncNotionDocuments, isPending } = useSyncNotionDocumentsMutation();

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
      });
  };

  return [handler, isPending] as const;
}
