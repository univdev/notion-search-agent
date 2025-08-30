import { useShallow } from 'zustand/shallow';
import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import useConversationQuery from '@/features/Conversations/models/useConversationQuery';
import ChatMessage, { CHAT_MESSAGE_SENDER } from '@/entities/Conversations/ui/ChatMessage/ChatMessage';
import Flex from '@/shared/App/ui/Flex/Flex';
import useStreamMessagesStore from '../../models/useStreamMessagesStore';
import useConversationScroll from '../../hooks/useConversationScroll';
import { cn } from '@/shared/Shadcn/utils';

export type ChatMessageListProps = {
  className?: string;
  isTyping?: boolean;
};

export default function ChatMessageList({ className, isTyping = false }: ChatMessageListProps) {
  const [conversationId] = useConversationId();
  const streamMessages = useStreamMessagesStore(useShallow((state) => state.messages));
  const [userMessage, assistantMessageStream] = streamMessages[conversationId] ?? [];
  const { data: chatHistory } = useConversationQuery(conversationId);
  const messages = chatHistory?.data.messages ?? [];

  useConversationScroll([userMessage, assistantMessageStream]);

  return (
    <Flex
      className={cn('chat-message-list w-full gap-y-8 px-2 overflow-y-auto relative', className)}
      direction="column"
    >
      {messages.map((message, index) => {
        return <ChatMessage key={index} sender={message.role} message={message.content} />;
      })}
      {isTyping && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message="..." />}
      {userMessage !== undefined && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message={userMessage} />}
      {assistantMessageStream !== undefined && (
        <ChatMessage sender={CHAT_MESSAGE_SENDER.ASSISTANT} message={assistantMessageStream} />
      )}
    </Flex>
  );
}
