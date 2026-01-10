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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {heading}
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 p-5">
            <div className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">{step.title}</h3>
              {step.description && (
                <p className="text-gray-500 text-sm mt-1">{step.description}</p>
              )}
              {step.command && (
                <code className="block mt-2 px-3 py-2 bg-gray-50 rounded-lg font-mono text-sm text-gray-700">
                  {step.command}
                </code>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
