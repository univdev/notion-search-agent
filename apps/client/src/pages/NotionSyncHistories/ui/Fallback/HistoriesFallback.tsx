import { Spinner } from '@/shared/shadcn-ui/spinner';

export default function HistoriesFallback() {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Spinner />
    </div>
  );
}
