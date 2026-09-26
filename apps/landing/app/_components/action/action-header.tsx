import Link from "next/link";

interface ActionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
}

export function ActionHeader({
  eyebrow,
  title,
  subtitle,
  description,
}: ActionHeaderProps) {
  return (
    <header className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-sm text-light-text-muted dark:text-text-muted hover:text-accent-yellow transition-colors"
      >
        <span aria-hidden="true">←</span> Ralph Alpha
      </Link>

      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
          {eyebrow}
        </p>
        <div className="inline-flex items-baseline gap-3">
          <span className="text-accent-yellow font-mono text-2xl md:text-3xl font-medium">
            {">"}_
          </span>
          <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-light-text dark:text-text-primary">
            {title}
          </h1>
        </div>
        <p className="font-mono text-lg md:text-xl font-semibold text-accent-yellow">
          {subtitle}
        </p>
      </div>

      <p className="text-base md:text-lg text-light-text-muted dark:text-text-muted leading-relaxed max-w-2xl">
        {description}
      </p>
    </header>
  );
}
