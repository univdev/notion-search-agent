import { ReactNode } from 'react';

export default function Container({ children }: { children: ReactNode }) {
  return <div className="flex flex-col w-full h-full">{children}</div>;
}
