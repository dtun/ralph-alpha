interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </header>
  );
}
