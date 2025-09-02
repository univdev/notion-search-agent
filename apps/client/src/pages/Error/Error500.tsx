import { lazy, Suspense } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ROUTES from '@/shared/Configs/constants/Routes.constant';
import { Button } from '@/shared/Shadcn/ui/button';
import { Skeleton } from '@/shared/Shadcn/ui/skeleton';
import { AspectRatio } from '@/shared/Shadcn/ui/aspect-ratio';

const DotLottieReact = lazy(() =>
  import('@lottiefiles/dotlottie-react').then((module) => ({ default: module.DotLottieReact })),
);

export default function Error500() {
  const { t } = useTranslation('error');
  const navigate = useNavigate();

  return (
    <main className="flex flex-direction flex-col items-center w-full h-[100vh]">
      <div className="m-auto flex flex-col gap-4">
        <Suspense
          fallback={
            <AspectRatio ratio={2 / 1} className="w-full max-w-[600px]">
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          }
        >
          <DotLottieReact style={{ maxWidth: 600 }} src={'/lottie/error.lottie'} autoplay />
        </Suspense>
        <p className="text-sm text-gray-600 text-center break-words px-12">
          <Trans t={t} i18nKey="500.message" components={{ br: <br /> }} />
        </p>
        <div className="flex flex-col w-full items-center justify-center">
          <Button type="button" variant="default" onClick={() => navigate(ROUTES.CONVERSATIONS.HOME)} size="sm">
            <Trans t={t} i18nKey="500.goToHome" />
          </Button>
        </div>
      </div>
    </main>
  );
}
