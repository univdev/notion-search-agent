import SyncronizeButton from '@/entities/NotionSyncronize/ui/SyncronizeButton/SyncronizeButton';
import useSyncNotionDocuments from '../api/useSyncNotionDocuments';
import useSyncNotionStreamStore from '../models/useSyncNotionStreamStore';
import { useShallow } from 'zustand/shallow';

export default function SyncronizeNotionDocumentsButton() {
  const [isPending, syncDocumentsCount] = useSyncNotionStreamStore(
    useShallow((state) => [state.isPending, state.syncDocumentsCount]),
  );
  const syncNotionDocuments = useSyncNotionDocuments();

  return (
    <SyncronizeButton isLoading={isPending} onClick={syncNotionDocuments} syncDocumentsCount={syncDocumentsCount} />
  );
}
