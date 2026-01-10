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

export function StepDetailPanel({
  step,
  stepNumber,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: StepDetailPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-brand-100 text-brand-600 text-sm font-semibold px-3 py-1 rounded-full">
          Step {stepNumber}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{step.label}</h3>
      </div>

      <p className="text-lg text-gray-700 mb-4">{step.description}</p>
      <p className="text-gray-600 mb-6">{step.details}</p>

      {step.code && (
        <div className="mb-6">
          <CodeBlock code={step.code} language={step.codeLanguage} />
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={!hasPrevious ? "opacity-50 cursor-not-allowed" : ""}
        >
          ← Previous
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!hasNext}
          className={!hasNext ? "opacity-50 cursor-not-allowed" : ""}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
