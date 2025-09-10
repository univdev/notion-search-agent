import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadcn-ui/table';
import { cn } from '@/shared/shadcn-utils';
import { format } from 'date-fns/format';
import { Trans, useTranslation } from 'react-i18next';

export type NotionDocument = {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
};

export type SavedDocumentsListProps = {
  className?: string;
  documents: NotionDocument[];
};

export default function SavedDocumentsList({ className, documents }: SavedDocumentsListProps) {
  const { t } = useTranslation('sync-history');
  const { t: commonT } = useTranslation('common');

  return (
    <Table className={cn('w-full', className)}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">{t('document.id')}</TableHead>
          <TableHead>{t('document.title')}</TableHead>
          <TableHead className="w-[200px]">{t('document.url')}</TableHead>
          <TableHead className="w-[100px]">{t('document.created-at')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id}>
            <TableCell>{document.id}</TableCell>
            <TableCell>{document.title}</TableCell>
            <TableCell>
              <a href={document.url} target="_blank" rel="noopener noreferrer">
                {t('document.open-in-new-tab')}
              </a>
            </TableCell>
            <TableCell>{format(document.createdAt, commonT('date.year-month-day-hour-minute-second'))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>
        <Trans t={t} i18nKey="document.documents-caption" values={{ count: documents.length }} />
      </TableCaption>
    </Table>
  );
}
