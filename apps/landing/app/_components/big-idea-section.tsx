interface BigIdeaSectionProps {
  heading: string;
  description: string;
}

export function BigIdeaSection({ heading, description }: BigIdeaSectionProps) {
  return (
    <section className="bg-brand-50 dark:bg-brand-700/20 rounded-2xl p-8 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-700 dark:text-brand-100 mb-4">
        {heading}
      </h2>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </section>
  );
}
