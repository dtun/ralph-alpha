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
  isLast = false,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center gap-2 group cursor-pointer
          transition-all duration-200
        `}
      >
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            font-semibold text-sm transition-all duration-200
            ${
              isActive
                ? "bg-brand-600 text-white scale-110 shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-700/30 group-hover:text-brand-600 dark:group-hover:text-brand-100"
            }
          `}
        >
          {stepNumber}
        </div>
        <span
          className={`
            text-xs font-medium transition-colors duration-200
            ${isActive ? "text-brand-600 dark:text-brand-100" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
          `}
        >
          {label}
        </span>
      </button>

      {!isLast && (
        <div className="hidden md:block w-12 lg:w-20 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
      )}
    </div>
  );
}
