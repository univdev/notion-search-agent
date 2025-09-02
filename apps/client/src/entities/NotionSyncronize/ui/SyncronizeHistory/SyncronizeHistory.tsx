import { Card, CardContent } from '@/shared/Shadcn/ui/card';
import { NOTION_SYNC_HISTORY_STATUS } from '../../models/NotionSyncronizeAPI';
import { cn } from '@/shared/Shadcn/utils';
import { Badge } from '@/shared/Shadcn/ui/badge';
import { Trans, useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/Shadcn/ui/tooltip';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shared/Shadcn/ui/table';

type NotionDocument = {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
};

export type SyncronizeHistoryProps = {
  className?: string;
  status: keyof typeof NOTION_SYNC_HISTORY_STATUS;
  createdAt: Date;
  documents: NotionDocument[];
};

export default function SyncronizeHistory({ className, status, createdAt, documents }: SyncronizeHistoryProps) {
  const { t: commonT } = useTranslation('common');
  const { t: syncHistoryT } = useTranslation('sync-history');

  return (
    <Card className={cn('syncronize-history', className)}>
      <CardContent className="w-full flex flex-col gap-y-2">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{syncHistoryT('documents.id')}</TableHead>
                <TableHead>{syncHistoryT('documents.title')}</TableHead>
                <TableHead className="w-[200px]">{syncHistoryT('documents.url')}</TableHead>
                <TableHead className="w-[100px]">{syncHistoryT('documents.created-at')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.id}</TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      {syncHistoryT('documents.open-in-new-tab')}
                    </a>
                  </TableCell>
                  <TableCell>{format(document.createdAt, commonT('date.year-month-day-hour-minute-second'))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              <Trans t={syncHistoryT} i18nKey="documents.documents-caption" values={{ count: documents.length }} />
            </TableCaption>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
