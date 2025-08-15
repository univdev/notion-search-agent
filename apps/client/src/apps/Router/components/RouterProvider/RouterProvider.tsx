import ChatPage from '@/pages/Chat/ChatPage';
import ROUTES from '@/shared/Router/constants/Routes.constant';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME.ROOT,
    element: <ChatPage />,
  },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}
