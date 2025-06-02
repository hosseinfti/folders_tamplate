import React, { useState } from "react";
import arrowRight from "../assets/arrow-right.tsx";
import arrowDown from "../assets/arrow-down.tsx";

export default function TreeNode({ node, onSelect, selectedId }) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <div style={{ paddingLeft: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: selectedId === node.id ? "bold" : "normal",
          background: selectedId === node.id ? "#333" : "transparent",
          borderRadius: 4,
          padding: "2px 4px",
        }}
        onClick={() => {
          if (isFolder) toggle();
          onSelect?.(node);
        }}
      >
        {isFolder && (
          <img
            src={expanded ? arrowDown : arrowRight}
            width="12"
            height="12"
            style={{ marginRight: 4 }}
          />
        )}
        {!isFolder && <span style={{ width: 16 }} />}{" "}
        {/* spacing placeholder */}
        <span>{node.name}</span>
      </div>

      {isFolder &&
        expanded &&
        node.children?.length > 0 &&
        [...node.children]
          .sort(
            (a, b) =>
              a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
          )
          .map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
    </div>
  );
}
