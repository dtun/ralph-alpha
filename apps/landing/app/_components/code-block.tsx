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
    <pre className={`overflow-x-auto ${bare ? "p-3 bg-gray-50 dark:bg-terminal-bg-subtle rounded border border-gray-200 dark:border-terminal-border" : "p-4 bg-white dark:bg-terminal-bg"}`}>
      <code className="font-mono text-sm leading-relaxed">
        {showLineNumbers
          ? lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 text-right pr-4 text-gray-400 dark:text-terminal-text-muted">
                  {i + 1}
                </span>
                <span className="text-gray-800 dark:text-terminal-text">{line}</span>
              </div>
            ))
          : <span className="text-gray-800 dark:text-terminal-text">{code}</span>
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
        <span className="font-mono text-xs text-gray-500 dark:text-terminal-text-muted ml-2">
          {displayName}
        </span>
      </div>

      {/* Code content */}
      {codeContent}
    </div>
  );
}
