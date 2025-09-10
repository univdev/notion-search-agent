import SyncronizeHistory from '@/entities/NotionSyncronize/ui/SyncronizeHistory/SyncronizeHistory';
import useNotionSyncHistoriesQuery from '../../models/useNotionSyncHistoriesQuery';
import { Spinner } from '@/shared/shadcn-ui/spinner';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/shadcn-ui/button';

export default function NotionHistoryList() {
  const {
    data: notionSyncHistories,
    isSuccess,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useNotionSyncHistoriesQuery();
  const items = notionSyncHistories ?? [];

  return (
    <div className="flex flex-col w-full gap-y-4">
      {isLoading && <NotionHistoryListLoading />}
      {isError && <NotionHistoryListError onRetry={refetch} />}
      {items.map((item) => (
        <SyncronizeHistory
          key={item._id}
          status={item.status}
          createdAt={item.createdAt}
          documents={item.documents.map((document) => ({
            id: document._id,
            title: document.title,
            url: document.url,
            createdAt: document.createdAt,
          }))}
        />
      ))}
      {hasNextPage && <NotionHistoryListLoading onLoadMore={fetchNextPage} />}
      {isSuccess && items.length === 0 && <NotionHistoryListEmpty />}
    </div>
  );
}

type NotionHistoryListLoadingProps = {
  onLoadMore?: () => void;
};

function NotionHistoryListLoading({ onLoadMore }: NotionHistoryListLoadingProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onLoadMore?.();
        }
      });
    });

    if (intersectionRef.current) {
      observer.current.observe(intersectionRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={intersectionRef} className="flex flex-col w-full gap-y-8 items-center justify-center">
      <Spinner />
    </div>
  );
}

function NotionHistoryListEmpty() {
  const { t } = useTranslation('sync-history');

  return <h3 className="flex flex-col w-full py-8 font-bold text-2xl text-center text-gray-500">{t('no-data')}</h3>;
}

type NotionHistoryListErrorProps = {
  onRetry: () => void;
};

function NotionHistoryListError({ onRetry }: NotionHistoryListErrorProps) {
  const { t } = useTranslation('sync-history');

  return (
    <div className="flex flex-col w-full py-4 text-center gap-y-4">
      <h3 className="flex flex-col w-full font-bold text-2xl text-center text-gray-500">{t('error.unknown-error')}</h3>
      <div className="flex justify-center">
        <Button type="button" onClick={onRetry}>
          {t('error.retry')}
        </Button>
      </div>
    </div>
  );
}
