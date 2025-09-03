import ReactQueryProvider from './apps/ReactQuery/components/ReactQueryProvider/ReactQueryProvider';
import RouterProvider from './apps/Router/components/RouterProvider/RouterProvider';
import ShadcnProvider from './shared/Shadcn/components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';
import ServerErrorDetector from './features/Health/components/ServerErrorDetector/ServerErrorDetector';
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
