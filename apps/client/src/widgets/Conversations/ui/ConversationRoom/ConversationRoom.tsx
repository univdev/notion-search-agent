import useDetectScrollBottom from '@/features/Conversations/hooks/useDetectScrollBottom';
import ChatMessageList from '@/features/Conversations/ui/ChatMessageList/ChatMessageList';
import ConversationMessageForm from '@/features/Conversations/ui/ConversationMessageForm/ConversationMessageForm';
import ScrollToBottomButton from '@/features/Conversations/ui/ScrollToBottomButton/ScrollToBottomButton';
import ANIMATION_VARIANTS from '@/shared/App/animations/Animation';
import Flex from '@/shared/App/ui/Flex/Flex';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

export default function ConversationRoom() {
  const [isTyping, setIsTyping] = useState(false);
  const { isBottom } = useDetectScrollBottom();

  return (
    <Flex className="conversation-room flex-auto" direction="column">
      <div className="flex flex-col chat-room-container flex-auto max-w-[960px] w-full m-auto">
        <Flex className="w-full flex-auto overflow-y-auto px-4 pb-10">
          <ChatMessageList className="flex-auto" isTyping={isTyping} />
        </Flex>
        <Flex className="sticky bottom-0 left-0 px-4 py-2 bg-white" alignItems="center" justifyContent="center">
          <AnimatePresence>
            {isBottom === false && (
              <ScrollToBottomButtonMotion
                variants={ANIMATION_VARIANTS.FADE_IN_DOWN}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute right-[50%] top-0 translate-x-[50%] translate-y-[-48px]"
              />
            )}
          </AnimatePresence>
          <ConversationMessageForm onTyping={setIsTyping} />
        </Flex>
      </div>
    </Flex>
  );
}

const ScrollToBottomButtonMotion = motion.create(ScrollToBottomButton);
