import ConversationForm from '@/entities/Conversations/ui/ConversationForm/ConversationForm';
import useSendMessageStream from '../../models/useSendMessageStream';

export default function SendChat() {
  const [handleSubmit] = useSendMessageStream();

  return <ConversationForm onSubmit={handleSubmit} />;
}
