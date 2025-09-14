import { FolderSync, Loader2 } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/shadcn-ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn-ui/tooltip';

export type SyncronizeButtonProps = {
  syncDocumentsCount?: number;
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function SyncronizeButton({
  isLoading = false,
  onClick,
  syncDocumentsCount = 0,
}: SyncronizeButtonProps) {
  const { t } = useTranslation('conversation');

  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick}>
        <Button disabled={isLoading} asChild variant="ghost" type="button" className="gap-x-2" size="sm">
          {isLoading ? <ProgressButtonContent count={syncDocumentsCount} /> : <DefaultButtonContent />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('sync-notion-documents-button.tooltip')}</p>
      </TooltipContent>
    </Tooltip>
  );
}

type ProgressLabelProps = {
  count: number;
};

function ProgressButtonContent({ count }: ProgressLabelProps) {
  const { t } = useTranslation('conversation');

  return (
    <div className="flex cursor-pointer items-center gap-x-2 text-sm">
      <Loader2 className="animate-spin" size={16} />
      <p>{t('sync-notion-documents-button.progress', { count })} </p>
    </div>
  );
}

function DefaultButtonContent() {
  const { t } = useTranslation('conversation');

  return (
    <div className="flex cursor-pointer items-center gap-x-2 text-sm">
      <FolderSync size={16} />
      <p>{t('sync-notion-documents-button.label')}</p>
    </div>
  );
}
