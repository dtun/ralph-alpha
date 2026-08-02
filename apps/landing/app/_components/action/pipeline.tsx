import type { PipelineStage } from "../../_data/action-content";

interface PipelineProps {
  stages: PipelineStage[];
}

export function Pipeline({ stages }: PipelineProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
        The path an issue takes
      </h2>
      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
        Two of these five stages are seams you can swap. The rest is plumbing
        Ralph owns.
      </p>

      <ol className="mt-6 space-y-0">
        {stages.map((stage, i) => (
          <li
            key={stage.id}
            id={stage.id}
            className="pipeline-stage flex gap-4 md:gap-6 -mx-3 px-3 rounded-md scroll-mt-24 transition-colors duration-300"
          >
            {/* Rail: marker plus the connector to the next stage */}
            <div
              className="flex flex-col items-center shrink-0"
              aria-hidden="true"
            >
              <span
                className={`pipeline-marker font-mono text-xs w-7 h-7 rounded-full border flex items-center justify-center tabular-nums transition-colors duration-300 ${
                  stage.seam
                    ? "border-accent-yellow text-accent-yellow"
                    : "border-light-border dark:border-dark-border text-light-text-muted dark:text-text-subtle"
                }`}
              >
                {i + 1}
              </span>
              {i < stages.length - 1 && (
                <span className="w-px grow bg-light-border dark:bg-dark-border" />
              )}
            </div>

            <div className="pb-8 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-mono text-sm md:text-base font-medium text-light-text dark:text-text-primary">
                  {stage.label}
                </h3>
                {stage.seam && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent-yellow border border-accent-yellow/40 rounded px-1.5 py-0.5">
                    seam · {stage.seam}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
                {stage.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
