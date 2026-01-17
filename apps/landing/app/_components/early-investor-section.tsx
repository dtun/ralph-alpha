export function EarlyInvestorSection() {
  return (
    <section className="relative rounded-md border border-light-border dark:border-dark-border p-6 md:p-8">
      <h2 className="font-mono text-base md:text-lg text-light-text-muted dark:text-text-muted mb-3">
        Early Investor
      </h2>
      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed mb-3">
        Ralph Alpha leverages the $RALPH primitive for managing agents. Simple
        persistence beats complex architecture. Multiplayer is opt-in. Loop,
        iterate, ship.
      </p>
      <a
        href="https://ralphcoin.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-light-text-muted dark:text-text-muted hover:text-accent-yellow hover:underline transition-colors"
      >
        ralphcoin.org →
      </a>
    </section>
  );
}
