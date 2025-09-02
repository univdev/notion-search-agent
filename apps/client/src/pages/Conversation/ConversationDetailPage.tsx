import Container from '@/shared/App/ui/Container/Container';
import ConversationRoom from '@/widgets/Conversations/ui/ConversationRoom/ConversationRoom';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

export default function ConversationDetailPage() {
  return (
    <NavigationSidebar>
      <div className="w-full flex flex-col relative">
        <ConversationHeader className="sticky top-0 left-0 w-full z-10" />
        <Container className="m-auto flex-auto">
          <ConversationRoom />
        </Container>
      </div>
    </NavigationSidebar>
  );
}
