import SyncronizeButton from '@/entities/NotionSyncronize/ui/SyncronizeButton/SyncronizeButton';
import useSyncNotionDocuments from '../api/useSyncNotionDocuments';

export default function SyncronizeNotionDocumentsButton() {
  const { isPending, syncDocumentsCount, handle } = useSyncNotionDocuments();

  return <SyncronizeButton isLoading={isPending} onClick={handle} syncDocumentsCount={syncDocumentsCount} />;
}
