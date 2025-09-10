import { cn } from '@/shared/shadcn-utils';
import { ReactNode } from 'react';

export type ContainerProps = {
  className?: string;
  children: ReactNode;
};

export default function Container({ children, className }: ContainerProps) {
  return <div className={cn('container flex flex-col w-full h-full', className)}>{children}</div>;
}
