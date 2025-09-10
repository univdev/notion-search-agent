import ROUTES from '@/shared/routes/Routes';
import { createBrowserRouter, Outlet, RouterProvider as ReactRouterProvider } from 'react-router';
import { lazy, Suspense } from 'react';
import ErrorPageFallback from '@/entities/Error/ui/ErrorPageFallback/ErrorPageFallback';
import StartPage from '@/pages/ConversationStartPage/StartPage';
import RoomFallback from '@/pages/ConversationRoomPage/ui/Fallback/RoomFallback';
import HistoriesFallback from '@/pages/NotionSyncHistories/ui/Fallback/HistoriesFallback';
import NavigationSidebar from '@/widgets/Navigation/ui/NavigationSidebar/NavigationSidebar';

const RoomPage = lazy(() =>
  import('@/pages/ConversationRoomPage/RoomPage').then((module) => ({ default: module.default })),
);
const HistoryListPage = lazy(() =>
  import('@/pages/NotionSyncHistories/HistoryListPage').then((module) => ({ default: module.default })),
);

const Error404 = lazy(() => import('@/pages/Error/Error404').then((module) => ({ default: module.default })));
const Error500 = lazy(() => import('@/pages/Error/Error500').then((module) => ({ default: module.default })));

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

function RootElement() {
  return (
    <NavigationSidebar>
      <Outlet />
    </NavigationSidebar>
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    ErrorBoundary: () => (
      <Suspense>
        <Error500 />
      </Suspense>
    ),
    element: <RootElement />,
    children: [
      {
        path: ROUTES.CONVERSATIONS.HOME,
        element: (
          <Suspense>
            <StartPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CONVERSATIONS.DETAIL,
        element: (
          <Suspense fallback={<RoomFallback />}>
            <RoomPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.SYNC_HISTORIES.NOTION,
        element: (
          <Suspense fallback={<HistoriesFallback />}>
            <HistoryListPage />
          </Suspense>
        ),
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
