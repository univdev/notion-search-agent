import { cn } from '@/shared/Shadcn/utils';
import { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import CodeViewer from './CodeViewer';

export type MarkdownViewerProps = {
  children: string;
} & ComponentProps<typeof Markdown>;

export default function MarkdownViewer({ children, components, ...props }: MarkdownViewerProps) {
  return (
    <Markdown
      components={{
        p: ({ children }) => <p className="text-[12px] lg:text-[16px] md:text-[14px]">{children}</p>,
        hr: () => <hr className="my-4" />,
        a: ({ children, href }) => (
          <a target="_blank" href={href} className="text-blue-500">
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          const language = className?.split('language-')[1];
          if (!language) {
            return (
              <code className={cn('text-[12px] lg:text-[16px] md:text-[14px] bg-gray-200 rounded-2xl my-4', className)}>
                {children}
              </code>
            );
          }

          return (
            <CodeViewer
              className={cn(
                'w-full overflow-x-auto text-[12px] lg:text-[16px] md:text-[14px] bg-gray-200 rounded-2xl my-4',
                '[&>code]:max-w-[100%] [&>code]:overflow-x-auto',
                className,
              )}
              style={{
                width: '100%',
                minWidth: '0',
                fontSize: '12px',
              }}
              language={language}
            >
              {children}
            </CodeViewer>
          );
        },
        ...components,
      }}
      {...props}
    >
      {children}
    </Markdown>
  );
}
