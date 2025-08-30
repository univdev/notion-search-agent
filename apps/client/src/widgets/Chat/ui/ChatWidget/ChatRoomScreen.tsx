import ChatMessageList from '@/features/Conversations/ui/ChatMessageList/ChatMessageList';
import SendChat from '@/features/Conversations/ui/SendChat/SendChat';
import Flex from '@/shared/App/ui/Flex/Flex';
import { useState } from 'react';

export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <Flex className="chat-room h-full overflow-hidden" direction="column">
      <Flex className="w-full flex-auto overflow-y-auto px-4">
        <ChatMessageList isTyping={isTyping} />
      </Flex>
      <Flex className="px-4 py-2 border-t" alignItems="center" justifyContent="center">
        <SendChat onTyping={setIsTyping} />
      </Flex>
    </Flex>
  );
}
