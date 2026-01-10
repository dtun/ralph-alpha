"use client";

import { useState } from "react";
import { StepIndicator } from "./step-indicator";
import { StepDetailPanel, WorkflowStep } from "./step-detail-panel";

interface WorkflowStepsProps {
  steps: WorkflowStep[];
}

export function WorkflowSteps({ steps }: WorkflowStepsProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-gray-900 dark:text-terminal-text mb-8 text-center">
        How It Works
      </h2>

      {/* Step indicators */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            stepNumber={index + 1}
            label={step.label}
            isActive={index === activeStep}
            onClick={() => setActiveStep(index)}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Detail panel */}
      <StepDetailPanel
        step={steps[activeStep]}
        stepNumber={activeStep + 1}
        onPrevious={() => setActiveStep((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
        }
        hasPrevious={activeStep > 0}
        hasNext={activeStep < steps.length - 1}
      />
    </section>
  );
}
