import Container from '@/shared/ui/Container/Container';
import StartSection from '@/pages/ConversationStartPage/ui/StartSection/StartSection';
import ConversationHeader from '@/widgets/Headers/ui/ConversationHeader/ConversationHeader';

export default function StartPage() {
  return (
    <div className="w-full flex flex-col relative">
      <ConversationHeader className="sticky top-0 left-0 w-full z-10" />
      <Container className="m-auto">
        <StartSection />
      </Container>
    </div>
  );
}
