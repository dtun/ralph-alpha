import { ReactNode } from "react";

interface ComponentCardProps {
  icon: ReactNode;
  title: string;
  description: string;
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

export function ComponentCard({ icon, title, description }: ComponentCardProps) {
  return (
    <div className="terminal-window group hover:border-terminal-cyan dark:hover:border-terminal-cyan transition-colors duration-150">
      {/* Title bar with macOS dots */}
      <div className="terminal-titlebar">
        <TerminalDots />
        <span className="font-mono text-xs text-gray-500 dark:text-terminal-text-muted ml-2">
          {title.toLowerCase().replace(/\s+/g, "-")}.tsx
        </span>
      </div>

      {/* Card content */}
      <div className="terminal-content">
        <div className="w-10 h-10 bg-gray-100 dark:bg-terminal-bg-subtle rounded flex items-center justify-center text-terminal-cyan mb-4">
          {icon}
        </div>
        <h3 className="font-mono text-base font-semibold text-gray-900 dark:text-terminal-text mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-terminal-text-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
