import type { FileEntry } from "../../_data/action-content";

interface FileMapProps {
  heading: string;
  files: FileEntry[];
}

export function FileMap({ heading, files }: FileMapProps) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
        {heading}
      </h2>
      <dl className="rounded-md border border-light-border dark:border-dark-border divide-y divide-light-border dark:divide-dark-border">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 p-4"
          >
            <dt className="font-mono text-sm text-accent-cyan sm:w-56 shrink-0">
              {file.path}
            </dt>
            <dd className="text-sm text-light-text-muted dark:text-text-muted leading-relaxed">
              {file.role}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
