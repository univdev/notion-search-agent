import ReactQueryProvider from './apps/react-query/ReactQueryProvider';
import RouterProvider from './apps/routes/RouterProvider';
import ShadcnProvider from './shared/shadcn-components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';
import ServerErrorDetector from './apps/server-health-checker/ServerErrorDetector';

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
