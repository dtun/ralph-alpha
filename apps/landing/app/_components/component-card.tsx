import { ReactNode } from "react";

interface ComponentCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
}

export function ComponentCard({ icon, title, description, isActive = false }: ComponentCardProps) {
  return (
    <div 
      className={`
        rounded-md border p-6 transition-all duration-300 flex flex-col items-center text-center
        ${isActive 
          ? "border-accent-yellow bg-accent-yellow/5 scale-[1.02] shadow-lg shadow-accent-yellow/20" 
          : "border-light-border dark:border-dark-border opacity-60 hover:opacity-80 hover:border-accent-yellow/30"
        }
      `}
    >
      {/* Icon */}
      <div 
        className={`
          w-12 h-12 rounded flex items-center justify-center mb-3 transition-all duration-300
          ${isActive 
            ? "bg-accent-yellow/20 text-accent-yellow scale-110" 
            : "bg-light-bg-subtle dark:bg-dark-bg-subtle text-accent-yellow"
          }
        `}
      >
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="font-mono text-sm font-semibold text-light-text dark:text-text-primary mb-1.5">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-light-text-muted dark:text-text-muted leading-relaxed">
        {description}
      </p>
    </div>
  );
}
