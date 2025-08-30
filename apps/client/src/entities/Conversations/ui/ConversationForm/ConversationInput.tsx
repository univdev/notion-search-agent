import { Proportions, Send, StopCircle } from 'lucide-react';

import Flex from '@/shared/App/ui/Flex/Flex';
import { Button } from '@/shared/Shadcn/ui/button';
import { Input } from '@/shared/Shadcn/ui/input';
import { cn } from '@/shared/Shadcn/utils';
import { useTranslation } from 'react-i18next';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Textarea } from '@/shared/Shadcn/ui/textarea';

export type ConversationInputProps = {
  value?: string;
  isLoading?: boolean;
  isValid?: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
} & ComponentProps<typeof Flex>;

export default function ConversationInput({
  className,
  value,
  isLoading = false,
  isValid = false,
  onChange,
  onCancel,
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
        {isLoading === false ? (
          <Button className="rounded-4xl cursor-pointer" size="icon" aria-label={t('form.input.send')} type="submit">
            <Send />
          </Button>
        ) : (
          <Button
            className={cn('rounded-4xl cursor-pointer disabled:cursor-default disabled:opacity-50')}
            size="icon"
            type="button"
            aria-label={t('form.input.cancel')}
            onClick={onCancel}
            disabled={!isValid}
          >
            <StopCircle />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
