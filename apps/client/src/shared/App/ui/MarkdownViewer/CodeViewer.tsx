import { ComponentProps, CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export type CodeViewerProps = {
  className?: string;
  language: string;
  style?: CSSProperties;
} & Omit<ComponentProps<typeof SyntaxHighlighter>, 'language' | 'style' | 'customStyle'>;

export default function CodeViewer({ language, children, className, style, ...props }: CodeViewerProps) {
  return (
    <SyntaxHighlighter language={language} style={dark} className={className} customStyle={style} {...props}>
      {children}
    </SyntaxHighlighter>
  );
}
