import { useShallow } from 'zustand/shallow';
import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import useConversationQuery from '@/features/MessageList/api/useConversationQuery';
import ChatMessage, { CHAT_MESSAGE_SENDER } from '@/entities/Conversations/ui/ChatMessage/ChatMessage';
import Flex from '@/shared/ui/Flex/Flex';
import useConversationScroll from '../../hooks/useConversationScroll';
import { cn } from '@/shared/shadcn-utils';
import useStreamMessagesStore from '@/entities/Conversations/models/useStreamMessagesStore';
import { Spinner } from '@/shared/shadcn-ui/spinner';
import { Button } from '@/shared/shadcn-ui/button';
import { useTranslation } from 'react-i18next';

export type ChatMessageListProps = {
  className?: string;
  isTyping?: boolean;
};

export default function ChatMessageList({ className, isTyping = false }: ChatMessageListProps) {
  const [conversationId] = useConversationId();

  if (conversationId === null) throw new Error('Conversation ID is not set');

  const streamMessages = useStreamMessagesStore(useShallow((state) => state.messages));
  const [userMessage, assistantMessageStream] = streamMessages[conversationId] ?? [];
  const {
    data: conversation,
    isLoading: isConversationLoading,
    isError: isConversationError,
    refetch: refetchConversation,
  } = useConversationQuery(conversationId);

  const messages = conversation?.data.messages ?? [];

  useConversationScroll(messages, assistantMessageStream ?? '');

  return (
    <Flex
      className={cn('chat-message-list w-full gap-y-8 px-2 overflow-y-auto relative', className)}
      direction="column"
    >
      {(() => {
        if (isConversationLoading === true) return <ChatMessageLoading />;
        else if (isConversationError === true) return <ChatMessageLoadError onRetry={refetchConversation} />;
        else {
          return messages.map((message, index) => {
            return <ChatMessage key={index} sender={message.role} message={message.content} />;
          });
        }
      })()}
      {isTyping && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message="..." />}
      {userMessage !== undefined && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message={userMessage} />}
      {assistantMessageStream !== undefined && (
        <ChatMessage sender={CHAT_MESSAGE_SENDER.ASSISTANT} message={assistantMessageStream} />
      )}
    </Flex>
  );
}

const ChatMessageLoading = () => {
  return (
    <div className="flex flex-col gap-y-8 px-2 overflow-y-auto relative items-center">
      <Spinner />
    </div>
  );
};

type ChatMessageLoadErrorProps = {
  onRetry: () => void;
};

const ChatMessageLoadError = ({ onRetry }: ChatMessageLoadErrorProps) => {
  const { t } = useTranslation('server-error');

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p>{t('conversation.list.load-failed')}</p>
      <Button type="button" variant="default" onClick={onRetry}>
        {t('conversation.list.retry')}
      </Button>
    </div>
  );
};
