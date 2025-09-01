import { useEffect, useState } from 'react';

const SCROLL_TO_BOTTOM_BUTTON_GAP = 120;

export default function useDetectScrollBottom(gap: number = SCROLL_TO_BOTTOM_BUTTON_GAP) {
  const [isBottom, setIsBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new ResizeObserver(checkBottom);
    observer.observe(window.document.documentElement);

    window.addEventListener('scroll', checkBottom);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkBottom);
    };
  }, []);

  const checkBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = window.document.documentElement;
    const isBottom = scrollTop + clientHeight + gap >= scrollHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    setIsBottom(isBottom);
    setIsAtBottom(isAtBottom);
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return {
    isBottom,
    isAtBottom,
    scrollToBottom,
    checkBottom,
  } as const;
}
