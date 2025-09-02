import ConversationDetailPage from '@/pages/Conversation/ConversationDetailPage';
import ConversationStartPage from '@/pages/Conversation/ConversationStartPage';
import HistoryListPage from '@/pages/NotionSyncHistories/HistoryListPage';
import ROUTES from '@/shared/Configs/constants/Routes.constant';
import { createBrowserRouter, Outlet, RouterProvider as ReactRouterProvider } from 'react-router';
import { lazy, Suspense } from 'react';
import ErrorPageFallback from '@/entities/Error/ui/ErrorPageFallback/ErrorPageFallback';

const Error404 = lazy(() => import('@/pages/Error/Error404').then((module) => ({ default: module.default })));
const Error500 = lazy(() => import('@/pages/Error/Error500').then((module) => ({ default: module.default })));

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

function RootElement() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    ErrorBoundary: () => (
      <Suspense fallback={<ErrorPageFallback />}>
        <Error500 />
      </Suspense>
    ),
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
        element: (
          <Suspense fallback={<ErrorPageFallback />}>
            <Error404 />
          </Suspense>
        ),
      },
    ],
  },
]);
