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
          alignItems && getAlignItemsClassName(alignItems),
          justifyContent && getJustifyContentClassName(justifyContent),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

function getAlignItemsClassName(alignItems: FlexProps['alignItems']) {
  switch (alignItems) {
    case 'flex-start':
      return 'items-start';
    case 'flex-end':
      return 'items-end';
    case 'center':
      return 'items-center';
    case 'stretch':
      return 'items-stretch';
    case 'baseline':
      return 'items-baseline';
    case 'space-between':
      return 'items-space-between';
    case 'space-around':
      return 'items-space-around';
    case 'space-evenly':
      return 'items-space-evenly';
    default:
      return alignItems;
  }
}

function getJustifyContentClassName(justifyContent: FlexProps['justifyContent']) {
  switch (justifyContent) {
    case 'flex-start':
      return 'justify-start';
    case 'flex-end':
      return 'justify-end';
    case 'center':
      return 'justify-center';
    case 'space-between':
      return 'justify-between';
    case 'space-around':
      return 'justify-around';
    case 'space-evenly':
      return 'justify-evenly';
    case 'stretch':
      return 'justify-stretch';
    case 'baseline':
      return 'justify-baseline';
    default:
      return justifyContent;
  }
}

export default Flex;
