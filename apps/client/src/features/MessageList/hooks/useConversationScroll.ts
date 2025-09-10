import { useEffect, useState } from 'react';

import useConversationId from '@/entities/Conversations/hooks/useConversationId';

import useDetectScrollBottom from './useDetectScrollBottom';

export default function useConversationScroll(messages: any[], streamMessage: string) {
  const { isAtBottom, scrollToBottom } = useDetectScrollBottom();
  const [conversationId] = useConversationId();
  let [previousStreamMessage, setPreviousStreamMessage] = useState('');

  // 대화문 진입 시 스크롤 맨 아래로 내림
  useEffect(() => {
    scrollToBottom();
  }, [conversationId, messages]);

  // 스트리밍 메시지 추가 시 스크롤 맨 아래로 내림
  useEffect(() => {
    if (isAtBottom === false || previousStreamMessage === streamMessage) return;

    scrollToBottom();
    setPreviousStreamMessage(streamMessage);
  }, [isAtBottom, streamMessage]);
}
