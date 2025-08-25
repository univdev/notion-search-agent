import ReactQueryProvider from './apps/ReactQuery/components/ReactQueryProvider/ReactQueryProvider';
import ErrorBoundary from './apps/Router/components/ErrorBoundary/ErrorBoundary';
import RouterProvider from './apps/Router/components/RouterProvider/RouterProvider';
import ShadcnProvider from './shared/Shadcn/components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ShadcnProvider>
      <ErrorBoundary>
        <ReactQueryProvider>
          <RouterProvider />
        </ReactQueryProvider>
      </ErrorBoundary>
      <Toaster />
    </ShadcnProvider>
  );
}
