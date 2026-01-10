interface ComparisonItem {
  title: string;
  points: string[];
}

interface ComparisonSectionProps {
  heading: string;
  before: ComparisonItem;
  after: ComparisonItem;
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

export function ComparisonSection({
  heading,
  before,
  after,
}: ComparisonSectionProps) {
  return (
    <section>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-light-text dark:text-text-primary mb-8 text-center">
        {heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before column */}
        <div className="terminal-window opacity-75">
          <div className="terminal-titlebar">
            <TerminalDots />
            <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
              solo-mode.log
            </span>
          </div>
          <div className="terminal-content">
            <h3 className="font-mono text-sm font-semibold text-light-text-muted dark:text-text-muted mb-4 flex items-center gap-2">
              <span className="text-accent-pink">[--]</span>
              {before.title}
            </h3>
            <ul className="space-y-2 font-mono text-sm">
              {before.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-light-text-muted dark:text-text-muted">
                  <span className="select-none">-</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* After column */}
        <div className="terminal-window border-accent-green">
          <div className="terminal-titlebar">
            <TerminalDots />
            <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
              multiplayer-mode.log
            </span>
          </div>
          <div className="terminal-content">
            <h3 className="font-mono text-sm font-semibold text-accent-green mb-4 flex items-center gap-2">
              <span>[++]</span>
              {after.title}
            </h3>
            <ul className="space-y-2 font-mono text-sm">
              {after.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-light-text dark:text-text-primary">
                  <span className="text-accent-green select-none">+</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
