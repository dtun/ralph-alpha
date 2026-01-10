interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

function TerminalDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-terminal-red" />
      <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
      <div className="w-3 h-3 rounded-full bg-terminal-green" />
    </div>
  );
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const lines = code.split("\n");
  const displayName = filename || language || "code";

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
      <pre className="p-4 overflow-x-auto bg-white dark:bg-terminal-bg">
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
    </div>
  );
}
