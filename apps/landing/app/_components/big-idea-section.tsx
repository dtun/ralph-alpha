interface BigIdeaSectionProps {
  heading: string;
  description: string;
}

export function BigIdeaSection({ heading, description }: BigIdeaSectionProps) {
  return (
    <section className="relative rounded-md border border-gray-200 dark:border-terminal-border bg-gray-50 dark:bg-terminal-bg-subtle p-8 md:p-12">
      {/* Decorative corner brackets */}
      <div className="absolute top-2 left-2 font-mono text-terminal-cyan text-lg opacity-50 select-none">
        {"["}
      </div>
      <div className="absolute bottom-2 right-2 font-mono text-terminal-cyan text-lg opacity-50 select-none">
        {"]"}
      </div>

      <h2 className="font-mono text-xl md:text-2xl font-bold text-terminal-cyan dark:text-terminal-cyan mb-4">
        {heading}
      </h2>
      <p className="text-base md:text-lg text-gray-700 dark:text-terminal-text-muted leading-relaxed">
        {description}
      </p>
    </section>
  );
}
