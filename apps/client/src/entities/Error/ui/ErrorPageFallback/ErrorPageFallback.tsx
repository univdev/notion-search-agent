import { Spinner } from '@/shared/shadcn-ui/spinner';

export default function ErrorPageFallback() {
  return (
    <main className="flex flex-direction flex-col items-center w-full h-[100vh]">
      <div className="m-auto flex flex-col gap-4">
        <Spinner />
      </div>
    </main>
  );
}
