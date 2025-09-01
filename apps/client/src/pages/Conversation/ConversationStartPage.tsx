import Container from '@/shared/App/ui/Container/Container';
import ConversationStart from '@/widgets/Conversations/ui/ConversationStart/ConversationStart';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

export default function ConversationStartPage() {
  return (
    <NavigationSidebar className="conversation-page flex">
      <div className="w-full flex flex-col relative">
        <ConversationHeader className="sticky top-0 left-0 w-full z-10" />
        <Container className="m-auto">
          <ConversationStart />
        </Container>
      </div>
    </NavigationSidebar>
  );
}
