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
import { Suspense, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CONVERSATION_QUERY_KEY } from '@/shared/query-keys/ConversationQueryKey';
import { useNavigate } from 'react-router';
import ROUTES from '@/shared/routes/Routes';
import ErrorBoundary from '@/shared/error-boundary/ErrorBoundary';

export type ChatMessageListProps = {
  className?: string;
  isTyping?: boolean;
};

export default function ChatMessageList({ className, isTyping = false }: ChatMessageListProps) {
  const [conversationId] = useConversationId();

  if (conversationId === null) throw new Error('Conversation ID is not set');

  return (
    <ErrorBoundary fallback={(onReset) => <ErrorComponent onRetry={onReset} />}>
      <Suspense fallback={<LoadingComponent />}>
        <SuccessComponent className={className} isTyping={isTyping} />
      </Suspense>
    </ErrorBoundary>
  );
}

type SuccessComponentProps = {
  className?: string;
  isTyping?: boolean;
};

const SuccessComponent = ({ className, isTyping }: SuccessComponentProps) => {
  const [conversationId] = useConversationId();
  if (conversationId === null) throw new Error('Conversation ID is not set');

  const streamMessages = useStreamMessagesStore(useShallow((state) => state.messages));
  const [userMessage, assistantMessageStream] = streamMessages[conversationId] ?? [];
  const { data: conversation } = useConversationQuery(conversationId);
  const messages = conversation?.data.messages ?? [];

  const isExistUserMessage = userMessage !== undefined;
  const isExistAssistantMessageStream = assistantMessageStream !== undefined;

  useConversationScroll(messages, assistantMessageStream ?? '');

  return (
    <Flex
      className={cn('chat-message-list w-full gap-y-8 px-2 overflow-y-auto relative', className)}
      direction="column"
    >
      {messages.map((message, index) => {
        return <ChatMessage key={index} sender={message.role} message={message.content} />;
      })}
      {isTyping && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message="..." />}
      {isExistUserMessage && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message={userMessage} />}
      {isExistAssistantMessageStream && (
        <ChatMessage sender={CHAT_MESSAGE_SENDER.ASSISTANT} message={assistantMessageStream} />
      )}
    </Flex>
  );
};

const LoadingComponent = () => {
  return (
    <div className="flex flex-col w-full gap-y-8 px-2 items-center">
      <Spinner />
    </div>
  );
};

type ErrorComponentProps = {
  onRetry: () => void;
};

const ErrorComponent = ({ onRetry }: ErrorComponentProps) => {
  const { t } = useTranslation('server-error');
  const queryClient = useQueryClient();
  const [conversationId] = useConversationId();
  const navigate = useNavigate();

  const retry = useCallback(() => {
    if (conversationId === null) {
      navigate(ROUTES.CONVERSATIONS.HOME);
    } else {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEY.detail(conversationId).queryKey });
    }
    onRetry();
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <p>{t('conversation.list.load-failed')}</p>
      <Button type="button" variant="default" onClick={retry}>
        {t('conversation.list.retry')}
      </Button>
    </div>
  );
};
