import { Controller, Form, useForm } from 'react-hook-form';

import ChatInput from './ChatInput';
import { cn } from '@/shared/Shadcn/utils';
import useChatId from '../../hooks/useChatId';

export type ChatFormProps = {
  className?: string;
  onSubmit: (message: string) => void;
};

export default function ChatForm({ className, onSubmit }: ChatFormProps) {
  const form = useForm();

  return (
    <Form
      control={form.control}
      onSubmit={(form) => onSubmit(form.data.message)}
      className={cn('mt-6 flex flex-col gap-4', className)}
    >
      <Controller
        control={form.control}
        name="message"
        render={({ field }) => <ChatInput value={field.value} onChange={field.onChange} />}
      />
    </Form>
  );
}
