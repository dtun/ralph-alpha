import { XIcon } from "./icons";

export function ComingSoonSection() {
  return (
    <section className="relative rounded-md border border-light-border dark:border-dark-border p-6 md:p-8">
      <h2 className="font-mono text-base md:text-lg text-light-text-muted dark:text-text-muted mb-3">
        Coming Soon
      </h2>
      <div className="flex items-center gap-4 text-light-text-muted dark:text-text-muted">
        <XIcon className="w-4 h-4" />
        <a
          href="https://x.com/dtuncodes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-yellow hover:underline transition-colors"
        >
          Updates
        </a>
        <a
          href="https://x.com/paperstreetapp"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-yellow hover:underline transition-colors"
        >
          Announcements
        </a>
      </div>
    </section>
  );
}
