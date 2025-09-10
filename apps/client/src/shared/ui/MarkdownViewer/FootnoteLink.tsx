import { cn } from '@/shared/shadcn-utils';
import { ReactNode } from 'react';

export type FootnoteLinkProps = {
  className?: string;
  children: ReactNode;
  href: string;
};

export default function FootnoteLink({ className, children, href }: FootnoteLinkProps) {
  return (
    <a
      target="_blank"
      className={cn(
        'inline-flex items-center justify-center text-blue-500 text-[10px] w-[12px] py-[2px] translate-y-[-2px] rounded-[4px] bg-gray-200 text-center',
        className,
      )}
      href={href}
    >
      {children}
    </a>
  );
}
