import { useTranslation } from 'react-i18next';

import ChatForm from '@/entities/Chat/ui/ChatForm/ChatForm';
import Flex from '@/shared/App/ui/Flex/Flex';
import { cn } from '@/shared/Shadcn/utils';
import { forwardRef } from 'react';

export type ChatStartProps = {
  className?: string;
};

const ChatStart = forwardRef<HTMLDivElement, ChatStartProps>(({ className }, ref) => {
  const { t } = useTranslation('chat');

  return (
    <Flex
      ref={ref}
      direction="column"
      className={cn('w-full h-full', className)}
      alignItems="center"
      justifyContent="center"
    >
      <h1 className="text-3xl font-bold text-center">{t('start.welcome')}</h1>
      <ChatForm onSubmit={() => {}} />
    </Flex>
  );
});

export default ChatStart;
