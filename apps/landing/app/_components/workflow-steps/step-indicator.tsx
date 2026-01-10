"use client";

interface StepIndicatorProps {
  stepNumber: number;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isLast?: boolean;
}

export function StepIndicator({
  stepNumber,
  label,
  isActive,
  onClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center gap-2 group cursor-pointer
          transition-all duration-150
        `}
      >
        <div
          className={`
            w-10 h-10 rounded-md flex items-center justify-center
            font-mono font-semibold text-sm transition-all duration-150 border
            ${
              isActive
                ? "bg-terminal-cyan/10 text-terminal-cyan border-terminal-cyan scale-105"
                : "bg-gray-100 dark:bg-terminal-bg-subtle text-gray-600 dark:text-terminal-text-muted border-gray-200 dark:border-terminal-border group-hover:border-terminal-cyan group-hover:text-terminal-cyan"
            }
          `}
        >
          {stepNumber}
        </div>
        <span
          className={`
            font-mono text-xs font-medium transition-colors duration-150
            ${
              isActive
                ? "text-terminal-cyan"
                : "text-gray-500 dark:text-terminal-text-muted group-hover:text-gray-700 dark:group-hover:text-terminal-text"
            }
          `}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
