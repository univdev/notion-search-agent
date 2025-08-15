import RouterProvider from './shared/Router/components/RouterProvider/RouterProvider';
import ShadcnProvider from './shared/Shadcn/components/ShadcnProvider/ShadcnProvider';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ShadcnProvider>
      <Toaster />
      <RouterProvider />
    </ShadcnProvider>
  );
}
