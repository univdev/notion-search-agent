import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import useConversationQuery from '@/features/Conversations/models/useChatHistoryQuery';
import { AnimatePresence, motion } from 'motion/react';
import ChatRoomScreen from './ChatRoomScreen';
import ChatStartScreen from './ChatStartScreen';
import { redirect } from 'react-router';
import ROUTES from '@/shared/Configs/constants/Routes.constant';
import ANIMATION_VARIANTS from '@/shared/App/animations/Animation';

export default function ChatWidget() {
  const [chatHistoryId] = useConversationId();
  const { data: chatHistory, isError } = useConversationQuery(chatHistoryId);

  if (isError) return redirect(ROUTES.CHAT.HOME);

  return (
    <main className="ChatPage w-full flex-auto">
      <AnimatePresence>
        {(() => {
          if (chatHistory)
            return (
              <ChatRoomScreenMotion
                variants={ANIMATION_VARIANTS.FADE_IN_UP}
                initial="initial"
                animate="animate"
                exit="exit"
              />
            );
          else
            return (
              <ChatStartScreenMotion
                variants={ANIMATION_VARIANTS.FADE_IN_DOWN}
                initial="initial"
                animate="animate"
                exit="exit"
              />
            );
        })()}
      </AnimatePresence>
    </main>
  );
}

const ChatRoomScreenMotion = motion(ChatRoomScreen);
const ChatStartScreenMotion = motion(ChatStartScreen);
