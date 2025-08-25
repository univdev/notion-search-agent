import ROUTES from '@/shared/Router/constants/Routes.constant';

export const NAVIGATION = [
  {
    label: 'navigation.application.label',
    type: 'default',
    children: [
      {
        label: 'navigation.application.chat.label',
        icon: 'chat',
        path: ROUTES.HOME.CHAT,
      },
      {
        label: 'navigation.application.histories.label',
        icon: 'history',
        path: ROUTES.HOME.HISTORY,
      },
    ],
  },
  {
    label: 'navigation.chat-histories.label',
    type: 'chat-histories',
    children: [],
  },
] as const;
