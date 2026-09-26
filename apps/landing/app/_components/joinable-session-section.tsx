import type {
  RoadmapStatus,
  RunsAsYouItem,
  SessionStep,
} from "../_data/explainer-content";

interface SessionComment {
  titlebar: string;
  author: string;
  status: string;
  localLabel: string;
  localCommand: string;
  remoteLabel: string;
  remoteCommand: string;
}

interface JoinableSessionSectionProps {
  eyebrow: string;
  heading: string;
  intro: string;
  runsAsYou: RunsAsYouItem[];
  steps: SessionStep[];
  comment: SessionComment;
  statusLabels: Record<RoadmapStatus, string>;
}

const statusStyles: Record<RoadmapStatus, string> = {
  v0: "text-accent-green border-accent-green/40",
  proven: "text-accent-yellow border-accent-yellow/40",
  next: "text-light-text-muted dark:text-text-subtle border-dashed border-light-border dark:border-dark-border",
};

const markerStyles: Record<RoadmapStatus, string> = {
  v0: "border-accent-green text-accent-green",
  proven: "border-accent-yellow text-accent-yellow",
  next: "border-dashed border-light-border dark:border-dark-border text-light-text-muted dark:text-text-subtle",
};

function StatusBadge({
  status,
  labels,
}: {
  status: RoadmapStatus;
  labels: Record<RoadmapStatus, string>;
}) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-wider rounded border px-1.5 py-0.5 ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function TerminalDots() {
  return (
    <div className="terminal-dots">
      <div className="terminal-dot" />
      <div className="terminal-dot" />
      <div className="terminal-dot" />
    </div>
  );
}

function IssueCommentMock({
  comment,
  labels,
}: {
  comment: SessionComment;
  labels: Record<RoadmapStatus, string>;
}) {
  return (
    <div className="terminal-window border-accent-yellow/60">
      <div className="terminal-titlebar">
        <TerminalDots />
        <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
          {comment.titlebar}
        </span>
        <span className="ml-auto">
          <StatusBadge status="proven" labels={labels} />
        </span>
      </div>
      <div className="terminal-content overflow-x-auto">
        <div className="font-mono text-sm leading-relaxed space-y-4 min-w-max">
          <div>
            <p className="text-light-text dark:text-text-primary">
              <span className="text-accent-yellow" aria-hidden="true">
                ●{" "}
              </span>
              <span className="font-semibold">{comment.author}</span>
              <span className="text-light-text-muted dark:text-text-muted">
                {" "}
                commented
              </span>
            </p>
            <p className="text-light-text-muted dark:text-text-muted pl-4">
              <span className="text-accent-green">✓</span> {comment.status}
            </p>
          </div>

          <div className="pl-4">
            <p className="text-light-text-muted dark:text-text-subtle">
              # {comment.localLabel}
            </p>
            <p className="text-light-text dark:text-text-primary">
              <span className="text-accent-yellow select-none">$ </span>
              {comment.localCommand}
            </p>
          </div>

          <div className="pl-4 opacity-60">
            <p className="text-light-text-muted dark:text-text-subtle">
              # {comment.remoteLabel}
            </p>
            <p className="text-light-text-muted dark:text-text-muted">
              <span className="select-none">$ </span>
              {comment.remoteCommand}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JoinableSessionSection({
  eyebrow,
  heading,
  intro,
  runsAsYou,
  steps,
  comment,
  statusLabels,
}: JoinableSessionSectionProps) {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-light-text-muted dark:text-text-subtle">
          {eyebrow}
        </p>
        <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
          {heading}
        </h2>
        <p className="text-base md:text-lg text-light-text-muted dark:text-text-muted leading-relaxed">
          {intro}
        </p>
      </div>

      <IssueCommentMock comment={comment} labels={statusLabels} />

      {/* Runs as you, not as a generic bot */}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {runsAsYou.map((item) => (
          <li
            key={item.label}
            className="rounded-md border border-light-border dark:border-dark-border bg-light-bg-subtle dark:bg-dark-bg-subtle p-4"
          >
            <h3 className="font-mono text-sm font-semibold text-light-text dark:text-text-primary flex gap-2">
              <span className="text-accent-yellow" aria-hidden="true">
                →
              </span>
              {item.label}
            </h3>
            <p className="mt-2 text-sm text-light-text-muted dark:text-text-muted leading-relaxed">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>

      {/* The loop, each step marked with how real it is */}
      <ol className="space-y-0">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-4 md:gap-6">
            <div
              className="flex flex-col items-center shrink-0"
              aria-hidden="true"
            >
              <span
                className={`font-mono text-xs w-7 h-7 rounded-full border flex items-center justify-center tabular-nums ${markerStyles[step.status]}`}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className="w-px grow bg-light-border dark:bg-dark-border" />
              )}
            </div>

            <div className="pb-7 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-mono text-sm md:text-base font-medium text-light-text dark:text-text-primary">
                  {step.label}
                </h3>
                <StatusBadge status={step.status} labels={statusLabels} />
              </div>
              <p className="mt-2 text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
