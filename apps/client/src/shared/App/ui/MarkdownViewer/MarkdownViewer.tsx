import { ComponentProps } from 'react';
import Markdown from 'react-markdown';

export type MarkdownViewerProps = {
  children: string;
} & ComponentProps<typeof Markdown>;

export default function MarkdownViewer({ children, components, ...props }: MarkdownViewerProps) {
  return (
    <Markdown
      components={{
        p: ({ children }) => <p className="text-[12px] lg:text-[16px] md:text-[14px]">{children}</p>,
        code: ({ children }) => (
          <code className="text-[12px] lg:text-[16px] md:text-[14px] bg-gray-200 rounded-2xl p-2">{children}</code>
        ),
        ...components,
      }}
      {...props}
    >
      {children}
    </Markdown>
  );
}
