import { XIcon } from "./icons";

export function ComingSoonSection() {
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
