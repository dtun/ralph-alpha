interface SetupStep {
  title: string;
  description?: string;
  command?: string;
}

interface SetupChecklistProps {
  heading: string;
  steps: SetupStep[];
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

export function SetupChecklist({ heading, steps }: SetupChecklistProps) {
  return (
    <section>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-light-text dark:text-text-primary mb-6">
        {heading}
      </h2>

      <div className="terminal-window">
        <div className="terminal-titlebar">
          <TerminalDots />
          <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
            setup.sh
          </span>
        </div>
        <div className="divide-y divide-light-border dark:divide-dark-border">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-5 bg-white dark:bg-dark-bg">
              <div className="flex-shrink-0 font-mono text-sm text-accent-yellow font-medium">
                [{index + 1}]
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-mono font-medium text-light-text dark:text-text-primary">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-light-text-muted dark:text-text-muted text-sm mt-1">
                    {step.description}
                  </p>
                )}
                {step.command && (
                  <div className="mt-3 px-3 py-2 bg-light-bg-subtle dark:bg-dark-bg-subtle rounded border border-light-border dark:border-dark-border">
                    <code className="font-mono text-sm text-light-text dark:text-text-primary flex items-center gap-2">
                      <span className="text-accent-green select-none">$</span>
                      <span>{step.command}</span>
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
