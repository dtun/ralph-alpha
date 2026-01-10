interface ComparisonItem {
  title: string;
  points: string[];
}

interface ComparisonSectionProps {
  heading: string;
  before: ComparisonItem;
  after: ComparisonItem;
}

export function ComparisonSection({
  heading,
  before,
  after,
}: ComparisonSectionProps) {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before column */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">😴</span>
            {before.title}
          </h3>
          <ul className="space-y-3">
            {before.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-gray-400 dark:text-gray-500">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* After column */}
        <div className="bg-brand-50 dark:bg-brand-700/20 rounded-xl p-6 md:p-8 border-2 border-brand-200 dark:border-brand-600">
          <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            {after.title}
          </h3>
          <ul className="space-y-3">
            {after.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-brand-500 dark:text-brand-100">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
