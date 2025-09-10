import { useNavigate, useParams } from 'react-router';

import ROUTES from '@/shared/routes/Routes';
import { CONVERSATION_ID_QUERY_PARAM_KEY } from '@/shared/constants/Conversations.constant';

export default function useConversationId() {
  const navigate = useNavigate();
  const param = useParams();
  const conversationId = param[CONVERSATION_ID_QUERY_PARAM_KEY] || null;

  const setConversationId = (id: string) => {
    navigate(`${ROUTES.CONVERSATIONS.DETAIL.replace(`:${CONVERSATION_ID_QUERY_PARAM_KEY}`, id)}`);
  };

  return [conversationId, setConversationId] as const;
}
