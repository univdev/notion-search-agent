import { Send } from 'lucide-react';

import Flex from '@/shared/App/ui/Flex/Flex';
import { Button } from '@/shared/Shadcn/ui/button';
import { cn } from '@/shared/Shadcn/utils';
import { useTranslation } from 'react-i18next';
import { ComponentProps, useRef } from 'react';
import { Textarea } from '@/shared/Shadcn/ui/textarea';

export type ConversationInputProps = {
  value?: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
} & ComponentProps<typeof Flex>;

export default function ConversationInput({
  className,
  value,
  isLoading = false,
  onChange,
  ...props
}: ConversationInputProps) {
  const { t } = useTranslation('conversation');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Flex
      className={cn('w-auto relative border-input shadow-input rounded-4xl px-2 py-4', 'border', className)}
      direction="column"
      alignItems="center"
      {...props}
    >
      <Textarea
        className={cn(
          'border-none shadow-none rounded-4xl px-4 outline-none w-full min-h-[14px] h-auto text-[14px] resize-none box-border',
          'focus-visible:ring-0',
        )}
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      <Flex className="w-full px-4 pt-2" justifyContent="flex-end">
        <Button
          className="rounded-4xl cursor-pointer"
          disabled={isLoading}
          size="icon"
          aria-label={t('form.input.send')}
          type="submit"
        >
          <Send />
        </Button>
      </Flex>
    </Flex>
  );
}
