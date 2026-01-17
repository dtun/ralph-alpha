export function EarlyInvestorSection() {
  return (
    <section className="relative rounded-md border border-light-border dark:border-dark-border bg-light-bg-subtle dark:bg-dark-bg-subtle p-8 md:p-12">
      {/* Decorative corner brackets */}
      <div className="absolute top-2 left-2 font-mono text-accent-yellow text-lg opacity-50 select-none">
        {"["}
      </div>
      <div className="absolute bottom-2 right-2 font-mono text-accent-yellow text-lg opacity-50 select-none">
        {"]"}
      </div>

      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow mb-4">
        Early Investor
      </h2>
      <p className="text-base md:text-lg text-light-text-muted dark:text-text-muted leading-relaxed mb-4">
        Ralph Alpha leverages the $RALPH primitive for managing agents. Simple
        persistence beats complex architecture. Multiplayer is opt-in. Loop,
        iterate, ship.
      </p>
      <a
        href="https://ralphcoin.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-accent-yellow hover:underline"
      >
        Learn more at ralphcoin.org →
      </a>
    </section>
  );
}
