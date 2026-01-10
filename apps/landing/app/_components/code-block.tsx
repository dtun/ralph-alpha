interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative rounded-lg bg-brand-700 overflow-hidden">
      {language && (
        <div className="px-4 py-2 text-xs font-mono text-brand-100 border-b border-brand-600">
          {language}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-brand-50 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}
