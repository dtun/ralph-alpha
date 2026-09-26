import type { Trap } from "../../_data/action-content";

interface TrapsProps {
  heading: string;
  intro: string;
  traps: Trap[];
}

export function Traps({ heading, intro, traps }: TrapsProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
        {heading}
      </h2>
      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
        {intro}
      </p>

      <ul className="space-y-3">
        {traps.map((trap) => (
          <li
            key={trap.title}
            className="rounded-md border border-light-border dark:border-dark-border p-6"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
              <h3 className="font-mono text-sm md:text-base font-medium text-light-text dark:text-text-primary">
                {trap.title}
              </h3>
              <span className="font-mono text-[11px] text-accent-pink border border-accent-pink/40 rounded px-1.5 py-0.5">
                {trap.tell}
              </span>
            </div>
            <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
              {trap.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
