export function Footer() {
  return (
    <footer className="border-t border-light-border dark:border-dark-border mt-16 py-8">
      <div className="text-center text-sm text-light-text-muted dark:text-text-muted">
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
