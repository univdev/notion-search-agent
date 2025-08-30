import SyncronizeNotionDocumentsButton from '@/features/Knowledges/ui/SyncronizeNotionDocumentsButton';
import { SidebarTrigger } from '@/shared/Shadcn/ui/sidebar';

export default function ConversationHeader() {
  return (
    <header className="Header flex items-center justify-between w-full p-4 h-[60px]">
      <SidebarTrigger />
      <SyncronizeNotionDocumentsButton />
    </header>
  );
}
