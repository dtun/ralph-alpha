import type { Gate } from "../../_data/action-content";

interface AfkGatesProps {
  heading: string;
  intro: string;
  outro: string;
  gates: Gate[];
}

export function AfkGates({ heading, intro, outro, gates }: AfkGatesProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
        {heading}
      </h2>
      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
        {intro}
      </p>

      <div className="overflow-x-auto rounded-md border border-light-border dark:border-dark-border">
        <table className="w-full text-left border-collapse min-w-[34rem]">
          <thead>
            <tr className="bg-light-bg-subtle dark:bg-dark-bg-subtle">
              <th className="font-mono text-[11px] uppercase tracking-wider text-light-text-muted dark:text-text-subtle font-medium p-4">
                Gate that expects a human
              </th>
              <th className="font-mono text-[11px] uppercase tracking-wider text-light-text-muted dark:text-text-subtle font-medium p-4">
                What replaces it
              </th>
            </tr>
          </thead>
          <tbody>
            {gates.map((gate) => (
              <tr
                key={gate.gate}
                className="border-t border-light-border dark:border-dark-border align-top"
              >
                <td className="p-4">
                  <span className="block font-mono text-sm text-light-text dark:text-text-primary">
                    {gate.gate}
                  </span>
                  <span className="block font-mono text-xs text-accent-cyan mt-1">
                    /{gate.source}
                  </span>
                </td>
                <td className="p-4 text-sm text-light-text-muted dark:text-text-muted leading-relaxed">
                  {gate.replacement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
        {outro}
      </p>
    </section>
  );
}
