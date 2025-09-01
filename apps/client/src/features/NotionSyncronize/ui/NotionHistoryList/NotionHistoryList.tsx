import SyncronizeHistory from '@/entities/NotionSyncronize/ui/SyncronizeHistory/SyncronizeHistory';
import useNotionSyncHistoriesQuery from '../../models/useNotionSyncHistoriesQuery';
import { Spinner } from '@/shared/Shadcn/ui/spinner';
import { useEffect, useRef } from 'react';

export default function NotionHistoryList() {
  const { data: notionSyncHistories, fetchNextPage, hasNextPage } = useNotionSyncHistoriesQuery();
  const items = notionSyncHistories ?? [];

  return (
    <div className="flex flex-col w-full gap-y-4">
      {items.map((item) => (
        <SyncronizeHistory
          key={item._id}
          status={item.status}
          ip={item.ip}
          totalPages={item.totalPages}
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
    <div ref={intersectionRef} className="flex flex-col w-full gap-y-4">
      <Spinner />
    </div>
  );
}
