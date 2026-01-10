import { CodeBlock } from "./code-block";

interface SetupStep {
  title: string;
  description?: string;
  command?: string;
}

interface SetupChecklistProps {
  heading: string;
  steps: SetupStep[];
}

export function SetupChecklist({ heading, steps }: SetupChecklistProps) {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {heading}
      </h2>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-200 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              {step.description && (
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
              )}
              {step.command && <CodeBlock code={step.command} language="bash" />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
