import { useQueryState } from 'nuqs';

import { CONVERSATION_ID_QUERY_PARAM_KEY } from '@/shared/Conversations/models/Conversations.constant';

export default function useConversationId() {
  return useQueryState(CONVERSATION_ID_QUERY_PARAM_KEY, { defaultValue: '' });
}
