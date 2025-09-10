import ReactQueryProvider from './apps/react-query/ReactQueryProvider';
import RouterProvider from './apps/routes/RouterProvider';
import ShadcnProvider from './shared/shadcn-components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';
import ServerErrorDetector from './apps/server-health-checker/ServerErrorDetector';
import WebVitals from './apps/web-vitals/WebVitals';

export default function App() {
  return (
    <ShadcnProvider>
      <WebVitals />
      <ReactQueryProvider>
        <ServerErrorDetector>
          <RouterProvider />
        </ServerErrorDetector>
      </ReactQueryProvider>
      <Toaster />
    </ShadcnProvider>
  );
}
