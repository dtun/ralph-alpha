import { ReactNode } from "react";

interface ComponentGridProps {
  children: ReactNode;
}

export function ComponentGrid({ children }: ComponentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}
