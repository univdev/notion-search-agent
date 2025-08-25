import { useQueryState } from 'nuqs';

export default function useChatId() {
  return useQueryState('chatId', { defaultValue: '' });
}
