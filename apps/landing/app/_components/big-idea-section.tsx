interface BigIdeaSectionProps {
  heading: string;
  description: string;
}

export function BigIdeaSection({ heading, description }: BigIdeaSectionProps) {
  return (
    <section className="bg-brand-50 rounded-2xl p-8 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-700 mb-4">
        {heading}
      </h2>
      <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
        {description}
      </p>
    </section>
  );
}
