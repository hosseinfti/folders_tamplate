import React from "react";

export default function ContextMenu({
  x,
  y,
  visible,
  node,
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
}) {
  if (!visible || !node) return null;

  const isFile = node.type === "file";

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: "4px 0",
        zIndex: 1000,
        width: 150,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {!isFile && <div onClick={() => onAddFile(node)}>📄 Add File</div>}
      {!isFile && <div onClick={() => onAddFolder(node)}>📁 Add Folder</div>}
      <div onClick={() => onRename(node)}>✏️ Rename</div>
      <div onClick={() => onDelete(node)}>🗑 Delete</div>
    </div>
  );
}
