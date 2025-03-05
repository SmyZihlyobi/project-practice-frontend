import ReactMarkdown from 'react-markdown';
import cn from 'classnames';

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}
export const Markdown = (props: MarkdownProps) => {
  const { text, className } = props;

  return (
    <div
      className={cn([
        'project-description border border-dashed p-3 rounded-md',
        className,
      ])}
      {...props}
    >
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-2xl font-bold mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-xl font-bold mb-2" {...props} />,
          p: ({ ...props }) => (
            <p className="text-base mb-4 leading-relaxed" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-blue-500 hover:text-blue-700 underline" {...props} />
          ),
          ul: ({ ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
          ol: ({ ...props }) => (
            <ol className="list-decimal list-inside mb-4" {...props} />
          ),
          li: ({ ...props }) => <li className="mb-2" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-muted pl-4 italic  mb-4"
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code className="bg-muted p-1 rounded text-sm font-mono" {...props} />
          ),
          pre: ({ ...props }) => (
            <pre
              className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4"
              {...props}
            />
          ),
          strong: ({ ...props }) => <strong className="font-bold" {...props} />,
          em: ({ ...props }) => <em className="italic" {...props} />,
          hr: ({ ...props }) => <hr className="my-4 border-t border-muted" {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
