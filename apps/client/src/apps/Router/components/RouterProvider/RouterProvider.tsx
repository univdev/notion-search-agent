import ChatPage from '@/pages/Chat/ChatPage';
import Error404 from '@/pages/Error/Error404';
import ROUTES from '@/shared/Router/constants/Routes.constant';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME.CHAT,
    element: <ChatPage />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]);
