import Flex from '@/shared/App/ui/Flex/Flex';
import { cn } from '@/shared/Shadcn/utils';
import { ComponentProps } from 'react';
import MarkdownViewer from '@/shared/App/ui/MarkdownViewer/MarkdownViewer';
import { Spinner } from '@/shared/Shadcn/ui/spinner';

export const CHAT_MESSAGE_SENDER = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const;

export type ChatMessageSender = (typeof CHAT_MESSAGE_SENDER)[keyof typeof CHAT_MESSAGE_SENDER];

export type ChatMessageProps = {
  typing?: boolean;
  sender: ChatMessageSender;
  message: string;
} & ComponentProps<typeof Flex>;

export default function ChatMessage({ sender, message, typing, ...props }: ChatMessageProps) {
  return (
    <Flex
      className={cn('chat-message w-full', props.className)}
      justifyContent={sender === CHAT_MESSAGE_SENDER.USER ? 'flex-end' : 'flex-start'}
      {...props}
    >
      {(() => {
        if (typing) return <Spinner />;

        switch (sender) {
          case CHAT_MESSAGE_SENDER.USER:
            return <UserComment message={message} />;
          case CHAT_MESSAGE_SENDER.ASSISTANT:
            return <AssistantComment message={message} />;
        }
      })()}
    </Flex>
  );
}

type UserCommentProps = {
  message: string;
};

function UserComment({ message }: UserCommentProps) {
  return (
    <div
      className={cn('chat-message-comment chat-message-comment--user rounded-4xl px-4 py-2 max-w-[65%] bg-yellow-300')}
    >
      <MarkdownViewer>{message}</MarkdownViewer>
    </div>
  );
}

type AssistantCommentProps = {
  message: string;
};

function AssistantComment({ message }: AssistantCommentProps) {
  return (
    <div className="chat-message-comment chat-message-comment--assistant w-full">
      <MarkdownViewer>{message}</MarkdownViewer>
    </div>
  );
}
