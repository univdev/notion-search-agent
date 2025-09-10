import { useQuery } from '@tanstack/react-query';

import { getConversation } from '@/entities/Conversations/api/ConversationAPI';
import { CONVERSATION_QUERY_KEY } from '@/shared/query-keys/ConversationQueryKey';

export default function useConversationQuery(conversationId: string) {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEY.detail(conversationId).queryKey,
    queryFn: () => getConversation(conversationId),
    select: (res) => res.data,
    enabled: !!conversationId,
  });
}
