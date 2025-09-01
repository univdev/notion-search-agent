import SyncronizeButton from '@/entities/NotionSyncronize/ui/SyncronizeButton/SyncronizeButton';
import useSyncNotionDocuments from '../models/useSyncNotionDocuments';

export default function SyncronizeNotionDocumentsButton() {
  const [handler, isPending] = useSyncNotionDocuments();

  return <SyncronizeButton isLoading={isPending} onClick={handler} />;
}
