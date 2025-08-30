import { useEffect, useState } from 'react';

export default function useDetectScrollBottom(gap: number = 0) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll: EventListener = () => {
      const { scrollTop, scrollHeight, clientHeight } = window.document.documentElement;
      const isBottom = scrollTop + clientHeight + gap >= scrollHeight;

      setIsBottom(isBottom);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    if (isBottom) return;

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return [isBottom, scrollToBottom] as const;
}
