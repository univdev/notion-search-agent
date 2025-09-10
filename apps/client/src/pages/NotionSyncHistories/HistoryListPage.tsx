import NotionHistoryList from '@/features/NotionSyncHistoryList/ui/NotionHistoryList/NotionHistoryList';
import Container from '@/shared/ui/Container/Container';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

export default function HistoryListPage() {
  return (
    <NavigationSidebar>
      <div className="flex flex-col w-full">
        <ConversationHeader />
        <main className="w-full pb-10">
          <Container className="m-auto px-4">
            <NotionHistoryList />
          </Container>
        </main>
      </div>
    </NavigationSidebar>
  );
}
