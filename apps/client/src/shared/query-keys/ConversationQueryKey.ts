import { createQueryKeys } from '@lukemorales/query-key-factory';

export const CONVERSATION_QUERY_KEY = createQueryKeys('conversation', {
  all: null,
  detail: (conversationId: string) => [conversationId],
});
