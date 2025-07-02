import React, { useState } from "react";
import arrowRight from "../assets/arrow-right.svg";
import arrowDown from "../assets/arrow-down.svg";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

export default function TreeNode({
  node,
  onSelect,
  selectedId,
  onRename,
  onDelete,
  query,
}) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";
  const lowerQuery = query?.toLowerCase();
  const nameMatch = node?.name?.toLowerCase()?.includes(lowerQuery);

  const searchedItem = (node.children || [])
    .map((child) => ({ ...child }))
    .filter((child) => {
      return (
        !query ||
        child.name.toLowerCase().includes(lowerQuery) ||
        (child.children &&
          child.children.some((c) => c.name.toLowerCase().includes(lowerQuery)))
      );
    });
  const toggle = () => setExpanded((prev) => !prev);
  if (query && !nameMatch && searchedItem.length === 0) return null;
  return (
    <div style={{ paddingLeft: "1rem" }}>
      <div
        data-id={node.id}
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
        {!isFolder && <span style={{ width: 16 }} />} <span>{node.name}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <img
            src={editIcon}
            width="12"
            height="12"
            title="Rename"
            onClick={(e) => {
              e.stopPropagation();
              const newName = prompt("Rename to:", node.name);
              if (newName) onRename?.(node.id, newName);
            }}
            style={{ cursor: "pointer" }}
          />
          <img
            src={deleteIcon}
            width="12"
            height="12"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Are you sure?")) onDelete?.(node.id);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {isFolder &&
        expanded &&
        searchedItem.length > 0 &&
        searchedItem
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
              onRename={onRename}
              onDelete={onDelete}
              query={query}
            />
          ))}
    </div>
  );
}
