"use client";

import { Button } from "@ralph/ui";
import { CodeBlock } from "../code-block";

export interface WorkflowStep {
  label: string;
  description: string;
  details: string;
  code?: string;
  codeLanguage?: string;
}

interface StepDetailPanelProps {
  step: WorkflowStep;
  stepNumber: number;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
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

export function StepDetailPanel({
  step,
  stepNumber,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: StepDetailPanelProps) {
  return (
    <div className="terminal-window mt-8">
      <div className="terminal-titlebar">
        <TerminalDots />
        <span className="font-mono text-xs text-gray-500 dark:text-terminal-text-muted ml-2">
          step-{stepNumber}.md
        </span>
      </div>

      <div className="terminal-content">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-sm text-terminal-amber">
            [{stepNumber}]
          </span>
          <h3 className="font-mono text-lg font-semibold text-gray-900 dark:text-terminal-text">
            {step.label}
          </h3>
        </div>

        <p className="text-base text-gray-700 dark:text-terminal-text mb-3">{step.description}</p>
        <p className="text-sm text-gray-600 dark:text-terminal-text-muted mb-6">{step.details}</p>

        {step.code && (
          <div className="mb-6">
            <CodeBlock code={step.code} language={step.codeLanguage} />
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-terminal-border">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`
              font-mono text-sm px-4 py-2 rounded border transition-colors duration-150
              ${hasPrevious
                ? "border-gray-300 dark:border-terminal-border text-gray-700 dark:text-terminal-text hover:border-terminal-cyan hover:text-terminal-cyan"
                : "opacity-40 cursor-not-allowed border-gray-200 dark:border-terminal-border text-gray-400 dark:text-terminal-text-muted"
              }
            `}
          >
            {"<--"} Previous
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`
              font-mono text-sm px-4 py-2 rounded border transition-colors duration-150
              ${hasNext
                ? "border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan hover:bg-terminal-cyan/20"
                : "opacity-40 cursor-not-allowed border-gray-200 dark:border-terminal-border text-gray-400 dark:text-terminal-text-muted"
              }
            `}
          >
            Next {"-->"}
          </button>
        </div>
      </div>
    </div>
  );
}
