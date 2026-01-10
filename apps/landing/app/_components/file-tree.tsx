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
      <div className="w-3 h-3 rounded-full bg-terminal-red" />
      <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
      <div className="w-3 h-3 rounded-full bg-terminal-green" />
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
      ? "text-terminal-cyan"
      : item.name.endsWith(".ts") || item.name.endsWith(".tsx")
        ? "text-terminal-green"
        : item.name.endsWith(".json") || item.name.endsWith(".yaml")
          ? "text-terminal-amber"
          : "text-gray-700 dark:text-terminal-text";

  return (
    <>
      <div className="flex items-start font-mono text-sm leading-relaxed">
        <span className="text-gray-400 dark:text-terminal-text-muted whitespace-pre select-none">
          {parentPrefixes}{connector}
        </span>
        <span className={nameColor}>
          {item.type === "folder" ? `${item.name}/` : item.name}
        </span>
        {item.comment && (
          <span className="text-gray-400 dark:text-terminal-text-muted ml-3 text-xs">
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
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-gray-900 dark:text-terminal-text mb-6">
        {heading}
      </h2>

      <div className="terminal-window">
        <div className="terminal-titlebar">
          <TerminalDots />
          <span className="font-mono text-xs text-gray-500 dark:text-terminal-text-muted ml-2">
            ~/your-repo
          </span>
        </div>
        <div className="terminal-content font-mono">
          <div className="text-sm text-terminal-cyan mb-2">.</div>
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
