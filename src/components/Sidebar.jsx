import styles from "./Sidebar.module.css";
import TreeNode from "./TreeNode";

export const Sidebar = ({
  tree,
  onSelect,
  selectedId,
  onAdd,
  onRename,
  onDelete,
  query,
}) => {
  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => {
          const input = prompt("Enter path (e.g. src/utils/helper.js)");
          if (input) onAdd(input);
        }}
      >
        + Add
      </button>

      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onSelect={onSelect}
          selectedId={selectedId}
          onRename={onRename}
          onDelete={onDelete}
          query={query}
        />
      ))}
    </div>
  );
};

export default Sidebar;
