import type { OwnershipColumn } from "../../_data/action-content";

interface OwnershipProps {
  ralph: OwnershipColumn;
  pack: OwnershipColumn;
  loopHeading: string;
  loopBody: string;
}

function Column({
  column,
  accent,
}: {
  column: OwnershipColumn;
  accent: boolean;
}) {
  return (
    <div className="rounded-md border border-light-border dark:border-dark-border bg-light-bg-subtle dark:bg-dark-bg-subtle p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-wider text-light-text-muted dark:text-text-subtle">
        {column.caption}
      </p>
      <h3
        className={`font-mono text-lg font-bold mt-1 mb-4 ${
          accent
            ? "text-accent-yellow"
            : "text-light-text dark:text-text-primary"
        }`}
      >
        {column.title}
      </h3>
      <ul className="space-y-2.5">
        {column.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed"
          >
            <span
              className={`font-mono shrink-0 ${accent ? "text-accent-yellow" : "text-accent-cyan"}`}
              aria-hidden="true"
            >
              →
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Ownership({
  ralph,
  pack,
  loopHeading,
  loopBody,
}: OwnershipProps) {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
        A line down the middle
      </h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Column column={ralph} accent />
        <Column column={pack} accent={false} />
      </div>

      <div className="rounded-md border border-light-border dark:border-dark-border p-6 md:p-8">
        <h3 className="font-mono text-base font-bold text-light-text dark:text-text-primary mb-3">
          {loopHeading}
        </h3>
        <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
          {loopBody}
        </p>
      </div>
    </section>
  );
}
