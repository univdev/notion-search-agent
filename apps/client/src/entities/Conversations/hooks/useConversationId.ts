import { useQueryState } from 'nuqs';

export default function useConversationId() {
  return useQueryState('conversationId', { defaultValue: '' });
}
