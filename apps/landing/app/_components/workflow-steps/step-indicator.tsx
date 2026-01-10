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
                ? "bg-accent-yellow/10 text-accent-yellow border-accent-yellow scale-105"
                : "bg-light-bg-subtle dark:bg-dark-bg-subtle text-light-text-muted dark:text-text-muted border-light-border dark:border-dark-border group-hover:border-accent-yellow group-hover:text-accent-yellow"
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
                ? "text-accent-yellow"
                : "text-light-text-muted dark:text-text-muted group-hover:text-light-text dark:group-hover:text-text-primary"
            }
          `}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
