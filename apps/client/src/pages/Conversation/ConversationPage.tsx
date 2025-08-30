import Container from '@/shared/App/ui/Container/Container';
import ChatWidget from '@/widgets/Chat/ui/ChatWidget/ChatWidget';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

export default function ConversationPage() {
  return (
    <NavigationSidebar>
      <div className="flex flex-col w-full">
        <ConversationHeader />
        <Container>
          <ChatWidget />
        </Container>
      </div>
    </NavigationSidebar>
  );
}
