import { useState } from "react";

function TreeNode({ name, children, path, onSelect }) {
  const [open, setOpen] = useState(false);
  const isFile = Object.keys(children).length === 0;

  // ⭐ FIX: Correct path creation for root & nested items
  const newPath = path ? `${path}/${name}` : name;

  return (
    <div className="ml-4">
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={() => {
          if (isFile) onSelect(newPath);
          else setOpen(!open);
        }}
      >
        <span>{isFile ? "📄" : open ? "📂" : "📁"}</span>
        <span>{name}</span>
      </div>

      {open &&
        !isFile &&
        Object.entries(children).map(([child, sub]) => (
          <TreeNode
            key={child}
            name={child}
            children={sub}
            path={newPath}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

export default function TreeView({ tree, onSelect }) {
  return (
    <div className="mt-3">
      {Object.entries(tree).map(([rootName, children]) => (
        <TreeNode
          key={rootName}
          name={rootName}
          children={children}
          path=""
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
