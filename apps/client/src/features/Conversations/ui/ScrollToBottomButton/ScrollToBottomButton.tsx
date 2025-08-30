import { Button } from '@/shared/Shadcn/ui/button';
import useDetectScrollBottom from '../../hooks/useDetectScrollBottom';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/shared/Shadcn/utils';
import { useTranslation } from 'react-i18next';

export type ScrollToBottomButtonProps = {
  className?: string;
};

export default function ScrollToBottomButton({ className }: ScrollToBottomButtonProps) {
  const { t } = useTranslation('conversation');
  const [_, scrollToBottom] = useDetectScrollBottom();

  return (
    <Button
      className={cn('rounded-4xl p-4', className)}
      aria-label={t('scroll-to-bottom')}
      size="icon"
      type="button"
      onClick={scrollToBottom}
    >
      <ArrowDown className="w-4 h-4" />
    </Button>
  );
}
