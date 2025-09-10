import { useTranslation } from 'react-i18next';

import Flex from '@/shared/ui/Flex/Flex';
import { cn } from '@/shared/shadcn-utils';
import { forwardRef } from 'react';
import ConversationMessageForm from '@/features/MessageSend/ui/ConversationMessageForm/ConversationMessageForm';

export type StartSectionProps = {
  className?: string;
};

const StartSection = forwardRef<HTMLDivElement, StartSectionProps>(({ className }, ref) => {
  const { t } = useTranslation('conversation');

  return (
    <Flex
      ref={ref}
      component="section"
      direction="column"
      className={cn('w-full h-full scroll-auto flex-auto', className)}
      alignItems="center"
      justifyContent="center"
    >
      <h1 className="text-3xl font-bold text-center sm:text-4xl">{t('start.welcome')}</h1>
      <Flex className="w-full">
        <Flex className="max-w-[768px] w-full m-auto mt-8 px-8">
          <ConversationMessageForm />
        </Flex>
      </Flex>
    </Flex>
  );
});

export default StartSection;
