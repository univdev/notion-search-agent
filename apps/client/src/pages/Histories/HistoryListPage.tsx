import Container from '@/shared/App/ui/Container/Container';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

export default function HistoryListPage() {
  return (
    <NavigationSidebar>
      <div className="flex flex-col w-full">
        <ConversationHeader />
        <main className="w-full">
          <Container className="m-auto">qwe</Container>
        </main>
      </div>
    </NavigationSidebar>
  );
}
