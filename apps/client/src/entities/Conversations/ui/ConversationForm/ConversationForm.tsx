import { Controller, Form, useForm } from 'react-hook-form';

import ConversationInput from './ConversationInput';
import { cn } from '@/shared/shadcn-utils';
import { CONVERSATION_FORM_SCHEMA } from '../../models/ConversationFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

export type ConversationFormProps = {
  className?: string;
  isLoading?: boolean;
  initialMessage?: string;
  onTyping?: (isTyping: boolean) => void;
  onSubmit: (message: string) => void;
};

type ConversationFormValues = {
  message: string;
};

export default function ConversationForm({
  className,
  isLoading = false,
  initialMessage = '',
  onTyping,
  onSubmit,
}: ConversationFormProps) {
  const form = useForm<ConversationFormValues>({
    resolver: zodResolver(CONVERSATION_FORM_SCHEMA),
    defaultValues: {
      message: initialMessage,
    },
  });
  const message = form.watch('message');

  useEffect(() => {
    if (message.length > 0) {
      onTyping?.(true);
    } else if (message.length === 0) {
      onTyping?.(false);
    }
  }, [message]);

  return (
    <Form
      control={form.control}
      onSubmit={(event) => {
        onSubmit(event.data.message);
        form.reset();
      }}
      className={cn('w-full flex flex-col gap-4', className)}
    >
      <Controller
        control={form.control}
        name="message"
        render={({ field }) => (
          <ConversationInput isLoading={isLoading} value={field.value} onChange={field.onChange} />
        )}
      />
    </Form>
  );
}
