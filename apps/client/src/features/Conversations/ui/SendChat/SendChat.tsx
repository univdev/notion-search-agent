import { sendChatMessageStream } from '@/entities/Conversations/api/ConversationAPI';
import useConversationId from '@/entities/Conversations/hooks/useConversationId';
import ConversationForm from '@/entities/Conversations/ui/ConversationForm/ConversationForm';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function SendChat() {
  const { t } = useTranslation();
  const [chatHistoryId, setChatHistoryId] = useConversationId();
  const handleSubmit = (message: string) => {
    sendChatMessageStream(message, chatHistoryId)
      .then((response) => {
        const ok = response.ok;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (ok === false) throw response;

        const read = async () => {
          if (!reader) return;

          const { done, value } = await reader.read();

          if (done) return;

          const values = exportStreamMessageObject(decoder.decode(value, { stream: true }));

          for (const { data } of values) {
            if (typeof data === 'object' && 'chatHistoryId' in data) {
              setChatHistoryId(data.chatHistoryId);
            }
          }

          read();
        };

        read();
      })
      .catch((error) => {
        const reader = error.body?.getReader();
        const decoder = new TextDecoder();

        const read = async () => {
          if (!reader) return;
          const { done, value } = await reader.read();

          console.log(value);
        };

        read();
      });
  };

  return <ConversationForm onSubmit={handleSubmit} />;
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
