import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import { sendConversationMessageStream } from '@/entities/Conversations/api/ConversationAPI';
import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import { CONVERSATION_QUERY_KEY } from '@/entities/Conversations/models/ConversationQueryKey';

import useStreamMessagesStore from './useStreamMessagesStore';

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
        if (typeof data === 'object' && 'isCompleted' in data && data.isCompleted) {
          queryClient.invalidateQueries({
            queryKey: CONVERSATION_QUERY_KEY.all.queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: CONVERSATION_QUERY_KEY.detail(currentConversationId as string).queryKey,
          });
          clearMessage(currentConversationId as string);
        } else if (typeof data === 'object' && 'conversationId' in data) {
          currentConversationId = data.conversationId;
          setConversationId(data.conversationId);
        } else if (typeof data === 'object' && 'message' in data) {
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
        if ('error' in error && 'errorKey' in error.error) toast.error(t(error.error.errorKey));
        else toast.error(t('server-error.conversation.question.unknown-error'));
      })
      .finally(() => {
        setPending(false);
      });
  };

  return [handler, isPending] as const;
}

function exportStreamMessageObject(data: string): { event: string; data: Record<string, string> | string }[] {
  const messages: { event: string; data: Record<string, string> | string }[] = data
    .split('\n')
    .filter(Boolean)
    .map((message) =>
      message
        .split(new RegExp(/^([\w]{1,}:) (.+)/))
        .map((m) => m.trim())
        .filter(Boolean),
    )
    .map(([event, data]) => {
      const eventName = event.split(':')[0];

      try {
        const parsedData = JSON.parse(data);
        return {
          event: eventName,
          data: parsedData,
        };
      } catch {
        return {
          event: eventName,
          data,
        };
      }
    });

  return messages;
}
