import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/shadcn-ui/sidebar';
import { MessageSquareMore } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/shared/shadcn-ui/button';
import Flex from '@/shared/ui/Flex/Flex';
import { Link } from 'react-router';
import ROUTES from '@/shared/routes/Routes';
import { useNavigationConversationsQuery } from '../../api/useNavigationChatHistoriesQuery';
import { CONVERSATION_ID_QUERY_PARAM_KEY } from '@/shared/constants/Conversations.constant';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn-ui/tooltip';
import { Spinner } from '@/shared/shadcn-ui/spinner';
import { useEffect, useRef } from 'react';

export default function ChatHistoriesGroup() {
  const { t } = useTranslation('sidebar');
  const {
    data: chatNavigationHistories,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useNavigationConversationsQuery();
  const histories = chatNavigationHistories?.flatMap((page) => page);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('navigation.chat-histories.label')}</SidebarGroupLabel>
      <SidebarGroupContent>
        {(() => {
          if (isLoading === true) return <LoadingIndicator />;
          else if (histories?.length === 0) return <NoChatHistories />;
          else if (isError === true) return <ErrorMessage onRetry={refetch} />;
          else
            return (
              <SidebarMenu>
                {histories?.map((item) => {
                  return <ChatHistoryItem key={item._id} itemId={item._id} summary={item.summary} />;
                })}
              </SidebarMenu>
            );
        })()}
        {hasNextPage && <LoadingIndicator onLoadMore={fetchNextPage} />}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export type LoadingIndicatorProps = {
  onLoadMore?: () => void;
};

function LoadingIndicator({ onLoadMore }: LoadingIndicatorProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onLoadMore?.();
        }
      });
    });

    if (lastItemRef.current) observer.current.observe(lastItemRef.current);

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return (
    <Flex
      ref={lastItemRef}
      className="w-full gap-y-1 py-1"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
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
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarMenuItem key={itemId}>
          <Link to={ROUTES.CONVERSATIONS.DETAIL.replace(`:${CONVERSATION_ID_QUERY_PARAM_KEY}`, itemId)}>
            <SidebarMenuButton>
              <MessageSquareMore />
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">{summary}</p>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </TooltipTrigger>
      <TooltipContent>{summary}</TooltipContent>
    </Tooltip>
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

  return (
    <p className="px-2 break-words">
      <Trans t={t} i18nKey="navigation.chat-histories.no-chat-histories.message" components={{ br: <br /> }} />
    </p>
  );
}
