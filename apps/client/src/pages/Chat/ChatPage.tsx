import { AnimatePresence } from 'motion/react';
import NavigationSideBar from '@/entities/Navigation/ui/NavigationSideBar/NavigationSideBar';
import Container from '@/shared/App/ui/Container/Container';
import { SidebarProvider } from '@/shared/Shadcn/ui/sidebar';
import SidebarWithHeader from '@/widgets/Chat/ui/SidebarWithHeader/SidebarWithHeader';
import ChatStart from '@/widgets/Chat/ui/ChatStart/ChatStart';

export default function ChatPage() {
  return (
    <SidebarProvider>
      <NavigationSideBar />
      <div className="flex flex-col w-full">
        <SidebarWithHeader />
        <Container>
          <main className="ChatPage w-full flex-auto overflow-y-scroll">
            <AnimatePresence>
              <ChatStart />
            </AnimatePresence>
          </main>
        </Container>
      </div>
    </SidebarProvider>
  );
}
