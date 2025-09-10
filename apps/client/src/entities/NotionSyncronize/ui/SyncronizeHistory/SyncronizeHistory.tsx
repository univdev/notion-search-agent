import { Card, CardContent } from '@/shared/shadcn-ui/card';
import { NOTION_SYNC_HISTORY_STATUS } from '../../api/NotionSyncronizeAPI';
import { cn } from '@/shared/shadcn-utils';
import { Badge } from '@/shared/shadcn-ui/badge';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns/format';
import { ArrowRight, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn-ui/tooltip';
import { Accordion, AccordionItem } from '@/shared/shadcn-ui/accordion';
import { AccordionContent, AccordionTrigger } from '@radix-ui/react-accordion';
import { Button } from '@/shared/shadcn-ui/button';
import { NotionDocument } from '../SavedDocumentsList/SavedDocumentsList';
import { lazy, Suspense, useState } from 'react';
import { Spinner } from '@/shared/shadcn-ui/spinner';

const SavedDocumentsList = lazy(() => import('../SavedDocumentsList/SavedDocumentsList'));

export type SyncronizeHistoryProps = {
  className?: string;
  status: keyof typeof NOTION_SYNC_HISTORY_STATUS;
  createdAt: Date;
  documents: NotionDocument[];
};

export default function SyncronizeHistory({ className, status, createdAt, documents }: SyncronizeHistoryProps) {
  const { t: commonT } = useTranslation('common');
  const { t: syncHistoryT } = useTranslation('sync-history');
  const [accordion, setAccordion] = useState('');

  return (
    <Card className={cn('syncronize-history', className)}>
      <CardContent className="w-full flex flex-col gap-y-4">
        <div className="w-full flex items-center justify-between">
          <Badge
            className={cn(
              status === NOTION_SYNC_HISTORY_STATUS.COMPLETED && 'bg-blue-500',
              status === NOTION_SYNC_HISTORY_STATUS.FAILED && 'bg-red-500',
              'text-white',
            )}
            variant="default"
          >
            {status}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm flex items-center gap-x-1" aria-label={syncHistoryT('created-at.label')}>
                <Calendar className="w-4 h-4" />
                {format(createdAt, commonT('date.year-month-day-hour-minute-second'))}
              </span>
            </TooltipTrigger>
            <TooltipContent>{syncHistoryT('created-at.label')}</TooltipContent>
          </Tooltip>
        </div>
        <div className="w-full flex items-center justify-between">
          <Accordion value={accordion} onValueChange={setAccordion} type="single" collapsible className="w-full">
            <AccordionItem value="documents">
              <AccordionTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex items-center gap-x-1 cursor-pointer">
                  {accordion === 'documents' ? syncHistoryT('hide-documents') : syncHistoryT('show-documents')}
                  <ArrowRight />
                </Button>
              </AccordionTrigger>
              <AccordionContent className="w-full">
                <Suspense
                  fallback={
                    <div className="w-full py-4 px-2 flex items-center justify-center">
                      <Spinner />
                    </div>
                  }
                >
                  <SavedDocumentsList documents={documents} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
