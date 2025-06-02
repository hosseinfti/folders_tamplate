import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import { initialTree } from "./data";
import ContextMenu from "./components/ContextMenu";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function findNodeById(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const result = findNodeById(node.children, id);
      if (result) return result;
    }
  }
  return null;
}

function removeNodeById(tree, id) {
  return tree.filter((node) => {
    if (node.id === id) return false;
    if (node.children) {
      node.children = removeNodeById(node.children, id);
    }
    return true;
  });
}

function renameNodeById(tree, id, newName) {
  for (const node of tree) {
    if (node.id === id) {
      node.name = newName;
      return;
    }
    if (node.children) renameNodeById(node.children, id, newName);
  }
}

function addNodeByPath(tree, pathStr, selectedNodeId) {
  const pathParts = pathStr.split("/");
  const newTree = deepClone(tree);
  let currentLevel = newTree;
  let parentId = null;

  if (selectedNodeId) {
    const selectedNode = findNodeById(newTree, selectedNodeId);
    if (selectedNode?.type === "folder") {
      currentLevel = selectedNode.children ??= [];
      parentId = selectedNode.id;
    } else if (selectedNode?.parentId) {
      const parentNode = findNodeById(newTree, selectedNode.parentId);
      if (!selectedNode.children) selectedNode.children = [];
      currentLevel = selectedNode.children;
      parentId = parentNode?.id ?? null;
    }
  }

  for (let i = 0; i < pathParts.length; i++) {
    const name = pathParts[i];
    const isFile = i === pathParts.length - 1 && name.includes(".");
    let existing = currentLevel.find((n) => n.name === name);

    if (!existing) {
      const newNode = {
        id: generateId(),
        name,
        type: isFile ? "file" : "folder",
        parentId,
        ...(isFile ? {} : { children: [] }),
      };
      currentLevel.push(newNode);
      existing = newNode;
    }
    parentId = existing.id;
    if (!existing.children) existing.children = [];
    currentLevel = existing.children;
  }

  return newTree;
}

export default function App() {
  const [tree, setTree] = useState(initialTree);
  const [selectedNode, setSelectedNode] = useState(null);
  const [context, setContext] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const handleAdd = (pathStr) => {
    setTree((prev) => addNodeByPath(prev, pathStr, selectedNode?.id));
    setSelectedNode(null);
  };

  const handleRename = (id, newName) => {
    setTree((prev) => {
      const cloned = deepClone(prev);
      renameNodeById(cloned, id, newName);
      return cloned;
    });
  };

  const resetContext = () => {
    setContext({
      visible: false,
      x: 0,
      y: 0,
      node: null,
    });
  };

  const handleDelete = (id) => {
    setTree((prev) => removeNodeById(prev, id));
    setSelectedNode(null);
  };

  const getPath = (node, parents = []) => {
    if (!node) return [];
    parents.unshift(node.name);
    if (!node.parentId) return parents;
    const parent = findNodeById(tree, node.parentId);
    return getPath(parent, parents);
  };

  const path = useMemo(
    () => getPath(selectedNode).join("/"),
    [selectedNode, tree]
  );

  useEffect(() => {
    if (selectedNode === null) {
      resetContext();
    }
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        const input = prompt("Enter path (e.g. src/utils/helper.js)");
        if (input) handleAdd(input);
      } else if (e.key === "Delete") {
        if (selectedNode) handleDelete(selectedNode.id);
      } else if (e.key === "F2") {
        if (selectedNode) {
          const newName = prompt("Rename to:", selectedNode.name);
          if (newName) handleRename(selectedNode.id, newName);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode]);

  useEffect(() => {
    const handleClick = () =>
      setContext({ visible: false, x: 0, y: 0, node: null });
    const handleContext = (e) => {
      e.preventDefault();
      const id = e.target?.closest("[data-id]")?.getAttribute("data-id");
      if (id) {
        const node = findNodeById(tree, id);
        setContext({ visible: true, x: e.pageX, y: e.pageY, node });
        setSelectedNode(node);
      } else {
        setContext({ visible: false, x: 0, y: 0, node: null });
      }
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleContext);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("contextmenu", handleContext);
    };
  }, [tree]);

  return (
    <div className="wrapper">
      <Sidebar
        tree={tree}
        onSelect={setSelectedNode}
        selectedId={selectedNode?.id}
        onAdd={handleAdd}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <Content path={path} />
      <ContextMenu
        {...context}
        onAddFile={(node) => {
          const fileName = prompt("Enter file name (e.g. helper.js)");
          if (fileName) handleAdd(fileName);
        }}
        onAddFolder={(node) => {
          const folderName = prompt("Enter folder name");
          if (folderName) handleAdd(folderName);
        }}
        onRename={(node) => {
          const newName = prompt("Rename to:", node.name);
          if (newName) handleRename(node.id, newName);
        }}
        onDelete={(node) => handleDelete(node.id)}
      />
    </div>
  );
}
