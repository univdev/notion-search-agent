import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router';
import ROUTES from '../../constants/Routes.constant';
import ChatPage from '../../../../pages/Chat/ChatPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME.ROOT,
    element: <ChatPage />,
  },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}
