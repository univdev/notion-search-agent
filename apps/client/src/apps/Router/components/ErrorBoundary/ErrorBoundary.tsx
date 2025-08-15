import Error500 from '@/pages/Error/Error500';
import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  return <ReactErrorBoundary fallback={<Error500 />}>{children}</ReactErrorBoundary>;
}
