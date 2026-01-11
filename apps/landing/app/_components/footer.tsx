import { XIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-light-border dark:border-dark-border mt-16 py-8">
      <div className="text-center text-sm text-light-text-muted dark:text-text-muted">
        <div className="flex items-center justify-center gap-4 mb-4">
          <XIcon className="w-4 h-4" />
          <a
            href="https://x.com/dtuncodes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-accent-yellow hover:underline transition-colors"
          >
            <span>Updates</span>
          </a>
          <a
            href="https://x.com/paperstreetapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-accent-yellow hover:underline transition-colors"
          >
            <span>Announcements</span>
          </a>
        </div>
        <p>
          Incubated by{" "}
          <a
            href="https://paperstreetapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent-yellow hover:underline"
          >
            Paper Street App Co.
          </a>
        </p>
        <p className="mt-2">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
