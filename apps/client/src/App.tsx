import ReactQueryProvider from './apps/ReactQuery/components/ReactQueryProvider/ReactQueryProvider';
import RouterProvider from './apps/Router/components/RouterProvider/RouterProvider';
import ShadcnProvider from './shared/Shadcn/components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';
import ServerErrorDetector from './features/Health/components/ServerErrorDetector/ServerErrorDetector';

export default function App() {
  return (
    <ShadcnProvider>
      <ReactQueryProvider>
        <ServerErrorDetector>
          <RouterProvider />
        </ServerErrorDetector>
      </ReactQueryProvider>
      <Toaster />
    </ShadcnProvider>
  );
}
