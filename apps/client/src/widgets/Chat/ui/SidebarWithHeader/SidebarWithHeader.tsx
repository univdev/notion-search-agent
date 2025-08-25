import SyncNotionDocumentButton from '@/entities/Notion/ui/SyncNotionDocumentButton/SyncNotionDocumentButton';
import { SidebarTrigger } from '@/shared/Shadcn/ui/sidebar';

export default function SidebarWithHeader() {
  return (
    <header className="Header flex items-center justify-between w-full p-4 h-[60px]">
      <SidebarTrigger />
      <SyncNotionDocumentButton isLoading={false} onClick={() => {}} />
    </header>
  );
}
