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
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
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
        <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
          step-{stepNumber}.md
        </span>
      </div>

      <div className="terminal-content">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-sm text-accent-yellow">
            [{stepNumber}]
          </span>
          <h3 className="font-mono text-lg font-semibold text-light-text dark:text-text-primary">
            {step.label}
          </h3>
        </div>

        <p className="text-base text-light-text dark:text-text-primary mb-3">{step.description}</p>
        <p className="text-sm text-light-text-muted dark:text-text-muted mb-6">{step.details}</p>

        {step.code && (
          <div className="mb-6">
            <CodeBlock code={step.code} language={step.codeLanguage} bare />
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-light-border dark:border-dark-border">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`
              font-mono text-sm px-4 py-2 rounded border transition-colors duration-150
              ${hasPrevious
                ? "border-light-border dark:border-dark-border text-light-text dark:text-text-primary hover:border-accent-yellow hover:text-accent-yellow"
                : "opacity-40 cursor-not-allowed border-light-border dark:border-dark-border text-light-text-muted dark:text-text-muted"
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
                ? "border-accent-yellow bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow/20"
                : "opacity-40 cursor-not-allowed border-light-border dark:border-dark-border text-light-text-muted dark:text-text-muted"
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
