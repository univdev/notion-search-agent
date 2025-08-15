import ChatSidebar from '@/entities/Chat/ui/ChatSideBar/ChatSidebar';
import SyncNotionDocumentButton from '@/entities/Chat/ui/SyncNotionDocumentButton/SyncNotionDocumentButton';
import { SidebarTrigger } from '@/shared/Shadcn/ui/sidebar';

export default function ChatPage() {
  return (
    <main className="ChatPage">
      <ChatSidebar />
      <SyncNotionDocumentButton isLoading={true} onClick={() => {}} />
      <SidebarTrigger />
    </main>
  );
}
