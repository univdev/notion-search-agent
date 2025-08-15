import { FolderSync, Loader2 } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/Shadcn/ui/button';
import { cn } from '@/shared/Shadcn/utils';

export type SyncNotionDocumentButtonProps = {
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function SyncNotionDocumentButton({ isLoading = false, onClick }: SyncNotionDocumentButtonProps) {
  const { t } = useTranslation('chat');

  return (
    <Button
      className={cn(isLoading === false ? 'cursor-pointer' : 'cursor-wait')}
      type="button"
      onClick={onClick}
      variant="ghost"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <FolderSync />}
      <p>{t('sync-notion-documents-button.label')}</p>
    </Button>
  );
}
