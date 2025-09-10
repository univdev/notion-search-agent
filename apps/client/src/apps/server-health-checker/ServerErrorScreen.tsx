import Container from '@/shared/ui/Container/Container';
import { Button } from '@/shared/shadcn-ui/button';
import { cn } from '@/shared/shadcn-utils';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type ServerErrorScreenProps = {
  isRetrying?: boolean;
  onRetry: () => void;
};

export default function ServerErrorScreen({ isRetrying = true, onRetry }: ServerErrorScreenProps) {
  const { t } = useTranslation('error');

  return (
    <main className="w-full h-[100vh]">
      <Container className="m-auto">
        <div className="flex flex-col w-full m-auto gap-4">
          <h1 className="font-bold text-2xl text-center">{t('server-error.health-check.message')}</h1>
          <div className="flex m-auto items-center justify-center">
            <Button
              variant="default"
              className={cn('w-full cursor-pointer', isRetrying && 'cursor-wait')}
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('server-error.health-check.retry')}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
