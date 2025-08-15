import ROUTES from '@/shared/Router/constants/Routes.constant';

export const NAVIGATION = [
  {
    label: 'navigation.application.label',
    children: [
      {
        label: 'navigation.application.chat.label',
        icon: 'chat',
        path: ROUTES.HOME.ROOT,
      },
      {
        label: 'navigation.application.histories.label',
        icon: 'history',
        path: ROUTES.HOME.ROOT,
      },
    ],
  },
] as const;
