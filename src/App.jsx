import React, { useState, useMemo } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { initialTree } from './data';

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  const getPath = (node, parents = []) => {
    if (!node) return [];
    parents.unshift(node.name);
    if (!node.parentId) return parents;

    const findInTree = (nodes, id) => {
      for (let n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findInTree(n.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findInTree(initialTree, node.parentId);
    return getPath(parent, parents);
  };

  const path = useMemo(() => getPath(selectedNode).join('/'), [selectedNode]);

  return (
    <div className="wrapper">
      <Sidebar tree={initialTree} onSelect={setSelectedNode} selectedId={selectedNode?.id} />
      <Content path={path} />
    </div>
  );
}