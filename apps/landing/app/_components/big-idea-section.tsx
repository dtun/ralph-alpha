interface BigIdeaSectionProps {
  heading: string;
  description: string;
}

export function BigIdeaSection({ heading, description }: BigIdeaSectionProps) {
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
        {heading}
      </h2>
      <p className="text-base md:text-lg text-light-text-muted dark:text-text-muted leading-relaxed">
        {description}
      </p>
    </section>
  );
}
