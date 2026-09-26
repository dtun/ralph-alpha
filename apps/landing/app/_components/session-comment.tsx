import type {
  RoadmapStatus,
  SessionCommentData,
} from "../_data/explainer-content";

const statusStyles: Record<RoadmapStatus, string> = {
  v0: "text-accent-green border-accent-green/40",
  proven: "text-accent-yellow border-accent-yellow/40",
  next: "text-light-text-muted dark:text-text-subtle border-dashed border-light-border dark:border-dark-border",
};

export function StatusBadge({
  status,
  labels,
}: {
  status: RoadmapStatus;
  labels: Record<RoadmapStatus, string>;
}) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-wider rounded border px-1.5 py-0.5 whitespace-nowrap ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

// Pulsing dot for a live session. Still under reduced motion.
export function LiveDot() {
  return (
    <span className="relative inline-flex w-2 h-2" aria-hidden="true">
      <span className="absolute inline-flex w-full h-full rounded-full bg-accent-green opacity-60 animate-ping motion-reduce:animate-none" />
      <span className="relative inline-flex w-2 h-2 rounded-full bg-accent-green" />
    </span>
  );
}

// A mock of the comment Ralph posts on the issue when the session is up.
export function SessionComment({ comment }: { comment: SessionCommentData }) {
  return (
    <div className="terminal-window border-accent-yellow/60">
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <div className="terminal-dot" />
          <div className="terminal-dot" />
          <div className="terminal-dot" />
        </div>
        <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
          {comment.titlebar}
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
            <p className="text-light-text-muted dark:text-text-muted pl-4 flex items-center gap-2">
              <LiveDot />
              {comment.status}
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
