import ROUTES from '@/shared/Configs/constants/Routes.constant';

export const NAVIGATION = [
  {
    label: 'navigation.application.label',
    type: 'default',
    children: [
      {
        label: 'navigation.application.chat.label',
        icon: 'chat',
        path: ROUTES.CHAT.HOME,
      },
      {
        label: 'navigation.application.histories.label',
        icon: 'history',
        path: ROUTES.SYNC_HISTORIES.NOTION,
      },
    ],
  },
  {
    label: 'navigation.chat-histories.label',
    type: 'chat-histories',
    children: [],
  },
] as const;
