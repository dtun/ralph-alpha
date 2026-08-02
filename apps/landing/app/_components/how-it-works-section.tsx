import Link from "next/link";

export function HowItWorksSection() {
  return (
    <section className="relative rounded-md border border-light-border dark:border-dark-border p-6 md:p-8">
      <h2 className="font-mono text-base md:text-lg text-light-text-muted dark:text-text-muted mb-3">
        How It Works
      </h2>
      <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed mb-3">
        Label an issue and a runner picks it up. The Action installs a pinned
        skill pack, hands your agent the brief, and leaves a draft pull request
        with every judgment call written down.
      </p>
      <Link
        href="/action"
        className="font-mono text-light-text-muted dark:text-text-muted hover:text-accent-yellow hover:underline transition-colors"
      >
        Read the walkthrough →
      </Link>
    </section>
  );
}
