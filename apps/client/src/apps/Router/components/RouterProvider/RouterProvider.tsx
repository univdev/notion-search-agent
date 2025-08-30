import ConversationPage from '@/pages/Conversation/ConversationPage';
import Error404 from '@/pages/Error/Error404';
import ROUTES from '@/shared/Configs/constants/Routes.constant';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.CHAT.HOME,
    element: <ConversationPage />,
  },
  {
    path: ROUTES.SYNC_HISTORIES.NOTION,
    element: null,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]);
