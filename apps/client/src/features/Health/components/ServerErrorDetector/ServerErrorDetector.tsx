import { ReactNode } from 'react';
import useServerHealthQuery from '../../models/useServerHealthQuery';
import ServerErrorScreen from '../../ui/ServerErrorScreen/ServerErrorScreen';
import { isAxiosError } from 'axios';

export type ServerErrorDetectorProps = {
  children: ReactNode;
};

export default function ServerErrorDetector({ children }: ServerErrorDetectorProps) {
  const { isFetching, refetch: healthCheck, error: serverHealthError } = useServerHealthQuery();

  if (isAxiosError(serverHealthError)) return <ServerErrorScreen isRetrying={isFetching} onRetry={healthCheck} />;

  return children;
}
