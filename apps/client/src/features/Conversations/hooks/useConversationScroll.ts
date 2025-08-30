import { useEffect } from 'react';

import useDetectScrollBottom from './useDetectScrollBottom';

export default function useConversationScroll(dependencies: any[] = []) {
  const [isBottom] = useDetectScrollBottom();

  const scrollToBottom = () => {
    if (isBottom) return;

    window.scrollTo({
      top: document.body.scrollHeight,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);
}
