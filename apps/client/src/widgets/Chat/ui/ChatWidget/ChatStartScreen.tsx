import { useTranslation } from 'react-i18next';

import Flex from '@/shared/App/ui/Flex/Flex';
import { cn } from '@/shared/Shadcn/utils';
import { forwardRef } from 'react';
import SendChat from '@/features/Conversations/ui/SendChat/SendChat';

export type ChatStartProps = {
  className?: string;
};

const ChatStartScreen = forwardRef<HTMLDivElement, ChatStartProps>(({ className }, ref) => {
  const { t } = useTranslation('chat');

  return (
    <Flex
      ref={ref}
      component="section"
      direction="column"
      className={cn('w-full h-full scroll-auto', className)}
      alignItems="center"
      justifyContent="center"
    >
      <h1 className="text-3xl font-bold text-center sm:text-4xl">{t('start.welcome')}</h1>
      <Flex className="w-full">
        <Flex className="max-w-[768px] w-full m-auto mt-8 px-8">
          <SendChat />
        </Flex>
      </Flex>
    </Flex>
  );
});

export default ChatStartScreen;
