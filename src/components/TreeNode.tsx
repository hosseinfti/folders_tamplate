import React, { useState } from "react";
import arrowRight from "../assets/arrow-right.tsx";
import arrowDown from "../assets/arrow-down.tsx";

export default function TreeNode({ node }) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <div style={{ paddingLeft: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: isFolder ? "pointer" : "default",
        }}
        onClick={isFolder ? toggle : undefined}
      >
        {isFolder && (
          <img
            src={expanded ? arrowDown : arrowRight}
            width="12"
            height="12"
            style={{ marginRight: 4 }}
          />
        )}
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
          .map((child) => <TreeNode key={child.id} node={child} />)}
    </div>
  );
}
