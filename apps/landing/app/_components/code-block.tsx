interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  bare?: boolean;
}

function TerminalDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>
  );
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  bare = false,
}: CodeBlockProps) {
  const lines = code.split("\n");
  const displayName = filename || language || "code";

  const codeContent = (
    <pre className={`overflow-x-auto ${bare ? "p-3 bg-light-bg-subtle dark:bg-dark-bg-subtle rounded border border-light-border dark:border-dark-border" : "p-4 bg-white dark:bg-dark-bg"}`}>
      <code className="font-mono text-sm leading-relaxed">
        {showLineNumbers
          ? lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 text-right pr-4 text-light-text-muted dark:text-text-muted">
                  {i + 1}
                </span>
                <span className="text-light-text dark:text-text-primary">{line}</span>
              </div>
            ))
          : <span className="text-light-text dark:text-text-primary">{code}</span>
        }
      </code>
    </pre>
  );

  if (bare) {
    return codeContent;
  }

  return (
    <div className="terminal-window">
      {/* Terminal title bar */}
      <div className="terminal-titlebar">
        <TerminalDots />
        <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
          {displayName}
        </span>
      </div>

      {/* Code content */}
      {codeContent}
    </div>
  );
}
