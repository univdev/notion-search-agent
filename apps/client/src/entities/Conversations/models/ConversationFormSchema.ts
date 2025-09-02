import { z } from 'zod';

export const CONVERSATION_FORM_SCHEMA = z.object({
  message: z.string().min(1, { message: 'chat.form.message.required' }),
});
