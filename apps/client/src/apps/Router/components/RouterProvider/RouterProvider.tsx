import ConversationDetailPage from '@/pages/Conversation/ConversationDetailPage';
import ConversationStartPage from '@/pages/Conversation/ConversationStartPage';
import Error404 from '@/pages/Error/Error404';
import HistoryListPage from '@/pages/NotionSyncHistories/HistoryListPage';
import ROUTES from '@/shared/Configs/constants/Routes.constant';
import { createBrowserRouter, isRouteErrorResponse, Outlet, RouterProvider as ReactRouterProvider } from 'react-router';
import Error500 from '@/pages/Error/Error500';

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

function RootElement() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    ErrorBoundary: (error) => {
      if (isRouteErrorResponse(error)) console.log(error);

      return <Error500 />;
    },
    element: <RootElement />,
    children: [
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
        element: <HistoryListPage />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
]);
