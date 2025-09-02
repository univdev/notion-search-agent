import { FolderSync, Loader2 } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Flex from '@/shared/App/ui/Flex/Flex';
import { Button } from '@/shared/Shadcn/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/Shadcn/ui/tooltip';

export type SyncronizeButtonProps = {
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function SyncronizeButton({ isLoading = false, onClick }: SyncronizeButtonProps) {
  const { t } = useTranslation('conversation');

  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick}>
        <Button disabled={isLoading} asChild variant="ghost" type="button" className="gap-x-2" size="sm">
          <Flex className="cursor-pointer" alignItems="center">
            {isLoading ? <Loader2 className="animate-spin" /> : <FolderSync />}
            <p>{t('sync-notion-documents-button.label')}</p>
          </Flex>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('sync-notion-documents-button.tooltip')}</p>
      </TooltipContent>
    </Tooltip>
  );
}
