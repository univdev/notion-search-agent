import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import { sendConversationMessageStream } from '@/entities/Conversations/api/ConversationAPI';
import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import isLocalizedError from '@/shared/api/isInternalServerError';
import { CONVERSATION_QUERY_KEY } from '@/shared/query-keys/ConversationQueryKey';
import { NAVIGATION_QUERY_KEY } from '@/shared/query-keys/NavigationQueryKey';
import exportStreamMessageObject from '@/shared/stream/ExportStreamMessageObject';

import useStreamMessagesStore from '../models/useStreamMessagesStore';

export default function useSendMessageStream() {
  const { t } = useTranslation('server-error');
  const queryClient = useQueryClient();
  const [isPending, setPending] = useState(false);
  const [conversationId, setConversationId] = useConversationId();
  const setStreamMessage = useStreamMessagesStore(useShallow((state) => state.setMessage));
  const clearMessage = useStreamMessagesStore(useShallow((state) => state.clearMessage));

  const readStream = (response: Response, userMessage: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let currentConversationId = conversationId || null;

    if (!reader) return null;

    const read = async () => {
      const { done, value } = await reader.read();

      if (done) return;

      const values = exportStreamMessageObject(decoder.decode(value, { stream: true }));

      for (const { data } of values) {
        const isCompleted = typeof data === 'object' && 'isCompleted' in data && data.isCompleted;
        const hasConversationId = typeof data === 'object' && 'conversationId' in data;
        const hasMessage = typeof data === 'object' && 'message' in data;

        if (isCompleted) {
          queryClient.invalidateQueries({
            queryKey: CONVERSATION_QUERY_KEY.all.queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: CONVERSATION_QUERY_KEY.detail(currentConversationId as string).queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: NAVIGATION_QUERY_KEY.conversations.queryKey,
          });
          clearMessage(currentConversationId as string);
        } else if (hasConversationId) {
          currentConversationId = data.conversationId;
          setConversationId(data.conversationId);
        } else if (hasMessage) {
          setStreamMessage(currentConversationId as string, userMessage, data.message);
        }
      }

      read();
    };

    read();
  };

  const handler = (message: string) => {
    setPending(true);
    setStreamMessage(conversationId as string, message, '');
    sendConversationMessageStream(message, conversationId === null ? undefined : conversationId)
      .then(async (response) => {
        const isOK = response.ok;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json') && isOK === false) {
          const error = await response.json();
          throw error;
        }

        readStream(response, message);
      })
      .catch((error) => {
        if (isLocalizedError(error)) toast.error(t(error.localeKey));
        else toast.error(t('server-error.conversation.question.unknown-error'));
      })
      .finally(() => {
        setPending(false);
      });
  };

  return [handler, isPending] as const;
}
