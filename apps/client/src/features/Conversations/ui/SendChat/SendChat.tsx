import ConversationForm from '@/entities/Conversations/ui/ConversationForm/ConversationForm';
import useSendMessageStream from '../../models/useSendMessageStream';

export type SendChatProps = {
  onTyping?: (isTyping: boolean) => void;
};

export default function SendChat({ onTyping }: SendChatProps) {
  const [handleSubmit] = useSendMessageStream();

  return (
    <ConversationForm
      onSubmit={(value) => {
        handleSubmit(value);
        onTyping?.(false);
      }}
      onTyping={onTyping}
    />
  );
}
