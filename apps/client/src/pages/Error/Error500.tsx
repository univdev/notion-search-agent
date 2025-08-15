import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ROUTES from '@/shared/Router/constants/Routes.constant';
import { Button } from '@/shared/Shadcn/ui/button';

export default function Error500() {
  const { t } = useTranslation('error');
  const navigate = useNavigate();

  const goBack = () => {
    navigate(ROUTES.HOME.CHAT);
  };

  return (
    <main className="flex flex-direction flex-col items-center w-full flex-auto">
      <div className="text-2xl font-bold text-center m-auto flex flex-col gap-4 items-center">
        <DotLottieReact src={'/lottie/500.lottie'} autoplay loop />
        <p className="text-sm text-gray-600 text-center break-words px-12">
          <Trans t={t} i18nKey="500.message" components={{ br: <br /> }} />
        </p>
        <Button type="button" variant="default" onClick={goBack} size="sm">
          <Trans t={t} i18nKey="500.goToHome" />
        </Button>
      </div>
    </main>
  );
}
