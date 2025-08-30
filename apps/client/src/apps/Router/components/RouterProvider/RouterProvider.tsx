import ConversationDetailPage from '@/pages/Conversation/ConversationDetailPage';
import ConversationStartPage from '@/pages/Conversation/ConversationStartPage';
import Error404 from '@/pages/Error/Error404';
import ROUTES from '@/shared/Configs/constants/Routes.constant';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.CONVERSATIONS.HOME,
    element: <ConversationStartPage />,
  },
  {
    path: ROUTES.CONVERSATIONS.DETAIL,
    element: <ConversationDetailPage />,
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
