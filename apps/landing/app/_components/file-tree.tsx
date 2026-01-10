interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  comment?: string;
  children?: FileTreeItem[];
}

interface FileTreeProps {
  heading: string;
  items: FileTreeItem[];
}

function TerminalDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>
  );
}

function FileTreeNode({
  item,
  depth = 0,
  isLast = false,
  parentPrefixes = "",
}: {
  item: FileTreeItem;
  depth?: number;
  isLast?: boolean;
  parentPrefixes?: string;
}) {
  const connector = isLast ? "└── " : "├── ";
  const childPrefix = parentPrefixes + (isLast ? "    " : "│   ");

  // Color coding based on type
  const nameColor =
    item.type === "folder"
      ? "text-accent-cyan"
      : item.name.endsWith(".ts") || item.name.endsWith(".tsx")
        ? "text-accent-green"
        : item.name.endsWith(".json") || item.name.endsWith(".yaml")
          ? "text-accent-yellow"
          : "text-light-text dark:text-text-primary";

  return (
    <>
      <div className="flex items-start font-mono text-sm leading-relaxed">
        <span className="text-light-text-muted dark:text-text-muted whitespace-pre select-none">
          {parentPrefixes}{connector}
        </span>
        <span className={nameColor}>
          {item.type === "folder" ? `${item.name}/` : item.name}
        </span>
        {item.comment && (
          <span className="text-light-text-muted dark:text-text-muted ml-3 text-xs">
            # {item.comment}
          </span>
        )}
      </div>
      {item.children?.map((child, index) => (
        <FileTreeNode
          key={index}
          item={child}
          depth={depth + 1}
          isLast={index === item.children!.length - 1}
          parentPrefixes={childPrefix}
        />
      ))}
    </>
  );
}

export function FileTree({ heading, items }: FileTreeProps) {
  return (
    <section>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-light-text dark:text-text-primary mb-6">
        {heading}
      </h2>

      <div className="terminal-window">
        <div className="terminal-titlebar">
          <TerminalDots />
          <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
            ~/your-repo
          </span>
        </div>
        <div className="terminal-content font-mono">
          <div className="text-sm text-accent-yellow mb-2">.</div>
          <div className="space-y-0.5">
            {items.map((item, index) => (
              <FileTreeNode
                key={index}
                item={item}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
