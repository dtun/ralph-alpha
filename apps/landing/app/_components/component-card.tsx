import { ReactNode } from "react";

interface ComponentCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ComponentCard({ icon, title, description }: ComponentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all duration-200">
      <div className="w-12 h-12 bg-brand-100 dark:bg-brand-700/30 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-100 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
