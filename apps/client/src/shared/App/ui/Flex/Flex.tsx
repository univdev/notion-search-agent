import { CSSProperties, ElementType, forwardRef, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/Shadcn/utils';

export type FlexProps = {
  className?: string;
  component?: ElementType;
  direction?: 'row' | 'column';
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

const Flex = forwardRef<HTMLElement, FlexProps>(
  ({ className, component: Component = 'div', direction, alignItems, justifyContent, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'flex',
          direction === 'row' && 'flex-row',
          direction === 'column' && 'flex-col',
          alignItems && `items-${alignItems}`,
          justifyContent && `justify-${justifyContent}`,
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export default Flex;
