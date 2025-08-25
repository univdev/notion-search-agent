import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/Shadcn/ui/sidebar';
import { MessageSquareMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigationChatHistoriesQuery } from '../../api/useNavigationChatHistoriesQuery';
import { Skeleton } from '@/shared/Shadcn/ui/skeleton';
import { Button } from '@/shared/Shadcn/ui/button';
import Flex from '@/shared/App/ui/Flex/Flex';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

export default function ChatHistoriesGroup() {
  const { t } = useTranslation('sidebar');
  const { data: chatNavigationHistories, isLoading, isError, refetch } = useNavigationChatHistoriesQuery();
  console.log(chatNavigationHistories, isError);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('navigation.chat-histories.label')}</SidebarGroupLabel>
      <SidebarGroupContent>
        {(() => {
          if (isLoading === true) return <LoadingIndicator />;
          else if (chatNavigationHistories?.data?.length === 0) return <NoChatHistories />;
          else if (isError === true) return <ErrorMessage onRetry={refetch} />;
          else
            return (
              <SidebarMenu>
                {chatNavigationHistories?.data.map((item) => {
                  return <ChatHistoryItem key={item._id} itemId={item._id} summary={item.summary} />;
                })}
              </SidebarMenu>
            );
        })()}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function LoadingIndicator() {
  return (
    <Flex className="w-full gap-y-1 py-1" alignItems="center" justifyContent="center" direction="column">
      <Spinner />
    </Flex>
  );
}

type ChatHistoryItemProps = {
  itemId: string;
  summary: string;
};

function ChatHistoryItem({ itemId, summary }: ChatHistoryItemProps) {
  return (
    <SidebarMenuItem key={itemId}>
      <SidebarMenuButton>
        <MessageSquareMore />
        <p>{summary}</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

type ErrorMessageProps = {
  onRetry: () => void;
};

function ErrorMessage({ onRetry }: ErrorMessageProps) {
  const { t } = useTranslation('sidebar');

  return (
    <Flex className="text-center gap-y-2" direction="column" alignItems="center" justifyContent="center">
      <p className="px-1">{t('navigation.chat-histories.error.message')}</p>
      <Button className="cursor-pointer" type="button" size="sm" onClick={onRetry}>
        {t('navigation.chat-histories.error.retry')}
      </Button>
    </Flex>
  );
}

function NoChatHistories() {
  const { t } = useTranslation('sidebar');

  return <p>{t('navigation.chat-histories.no-chat-histories.message')}</p>;
}
