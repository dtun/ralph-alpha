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

function FileTreeNode({
  item,
  depth = 0,
}: {
  item: FileTreeItem;
  depth?: number;
}) {
  const indent = "│   ".repeat(depth);
  const prefix = item.type === "folder" ? "📁" : "📄";

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 font-mono text-sm whitespace-pre">
          {indent}├── {prefix}
        </span>
        <span className="font-mono text-sm text-gray-800">{item.name}</span>
        {item.comment && (
          <span className="text-gray-400 text-sm ml-2"># {item.comment}</span>
        )}
      </div>
      {item.children?.map((child, index) => (
        <FileTreeNode key={index} item={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function FileTree({ heading, items }: FileTreeProps) {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {heading}
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
        <div className="font-mono text-sm text-brand-600 mb-4">your-repo/</div>
        <div className="space-y-1">
          {items.map((item, index) => (
            <FileTreeNode key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
