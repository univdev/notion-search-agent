import ReactQueryProvider from './apps/react-query/ReactQueryProvider';
import RouterProvider from './apps/routes/RouterProvider';
import ShadcnProvider from './shared/shadcn-components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';
import ServerErrorDetector from './apps/server-health-checker/ServerErrorDetector';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

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
