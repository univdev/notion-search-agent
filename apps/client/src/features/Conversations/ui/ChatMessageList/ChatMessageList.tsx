import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import useConversationQuery from '@/features/Conversations/models/useChatHistoryQuery';
import ChatMessage, { CHAT_MESSAGE_SENDER } from '@/entities/Conversations/ui/ChatMessage/ChatMessage';
import Flex from '@/shared/App/ui/Flex/Flex';

export type ChatMessageListProps = {
  isTyping?: boolean;
};

export default function ChatMessageList({ isTyping = false }: ChatMessageListProps) {
  const [chatHistoryId] = useConversationId();
  const { data: chatHistory } = useConversationQuery(chatHistoryId);
  const messages = chatHistory?.data.messages ?? [];

  return (
    <Flex className="chat-message-list w-full gap-y-4 px-2 overflow-y-auto" direction="column">
      {messages.map((message, index) => {
        return <ChatMessage key={index} sender={message.role} message={message.content} />;
      })}
      {isTyping && <ChatMessage sender={CHAT_MESSAGE_SENDER.USER} message="..." />}
    </Flex>
  );
}
