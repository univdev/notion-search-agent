import Container from '@/shared/ui/Container/Container';
import RoomSection from '@/pages/ConversationRoomPage/ui/RoomSection/RoomSection';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';

export default function RoomPage() {
  return (
    <div className="w-full flex flex-col relative">
      <ConversationHeader className="sticky top-0 left-0 w-full z-10" />
      <Container className="m-auto flex-auto">
        <RoomSection />
      </Container>
    </div>
  );
}
