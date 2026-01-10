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
    <div className="terminal-window group hover:border-accent-yellow transition-colors duration-150">
      {/* Title bar with macOS dots */}
      <div className="terminal-titlebar">
        <TerminalDots />
        <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
          {title.toLowerCase().replace(/\s+/g, "-")}.tsx
        </span>
      </div>

      {/* Card content */}
      <div className="terminal-content">
        <div className="w-10 h-10 bg-light-bg-subtle dark:bg-dark-bg-subtle rounded flex items-center justify-center text-accent-yellow mb-4">
          {icon}
        </div>
        <h3 className="font-mono text-base font-semibold text-light-text dark:text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-light-text-muted dark:text-text-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
