import ConversationForm from '@/entities/Conversations/ui/ConversationForm/ConversationForm';
import useSendMessageStream from '../../models/useSendMessageStream';

export type ConversationMessageFormProps = {
  onTyping?: (isTyping: boolean) => void;
};

export default function ConversationMessageForm({ onTyping }: ConversationMessageFormProps) {
  const [handleSubmit, isPending] = useSendMessageStream();

  return (
    <ConversationForm
      isLoading={isPending}
      onSubmit={(value) => {
        handleSubmit(value);
        onTyping?.(false);
      }}
      onTyping={onTyping}
    />
  );
}
