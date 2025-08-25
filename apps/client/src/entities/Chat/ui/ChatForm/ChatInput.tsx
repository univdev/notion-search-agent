import { Send, StopCircle } from 'lucide-react';

import Flex from '@/shared/App/ui/Flex/Flex';
import { Button } from '@/shared/Shadcn/ui/button';
import { Input } from '@/shared/Shadcn/ui/input';
import { cn } from '@/shared/Shadcn/utils';
import { useTranslation } from 'react-i18next';

export type ChatInputProps = {
  value?: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
};

export default function ChatInput({ value, isLoading = false, onChange, onCancel }: ChatInputProps) {
  const { t } = useTranslation('chat');

  return (
    <Flex
      className={cn('w-full relative border-input shadow-input rounded-4xl px-2 pr-[48px]', 'border', 'h-[56px]')}
      alignItems="center"
    >
      <Input
        className={cn('border-none shadow-none rounded-4xl px-4 outline-none', 'lg:w-[768px]', 'focus-visible:ring-0')}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={t('form.input.placeholder')}
      />
      {isLoading === false ? (
        <Button
          className="absolute right-0 top-[50%] translate-y-[-50%] translate-x-[-50%] rounded-4xl cursor-pointer"
          size="icon"
          aria-label={t('form.input.send')}
          type="submit"
        >
          <Send />
        </Button>
      ) : (
        <Button
          className="absolute right-0 top-[50%] translate-y-[-50%] translate-x-[-50%] rounded-4xl cursor-pointer"
          size="icon"
          type="button"
          aria-label={t('form.input.cancel')}
          onClick={onCancel}
        >
          <StopCircle />
        </Button>
      )}
    </Flex>
  );
}
