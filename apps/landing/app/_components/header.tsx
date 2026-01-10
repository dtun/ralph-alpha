interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="text-center space-y-6">
      <div className="inline-flex items-center gap-3">
        <span className="text-accent-yellow font-mono text-3xl md:text-4xl font-medium">
          {">"}_
        </span>
        <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-light-text dark:text-text-primary">
          {title}
        </h1>
      </div>
      <p className="font-mono text-lg md:text-xl text-light-text-muted dark:text-text-muted max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </header>
  );
}
