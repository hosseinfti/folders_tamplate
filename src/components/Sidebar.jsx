import styles from "./Sidebar.module.css";
import TreeNode from "./TreeNode";

export const Sidebar = ({ tree, onSelect, selectedId }) => {
  return (
    <div className={styles.wrapper}>
      {tree.map(node => (
        <TreeNode key={node.id} node={node} onSelect={onSelect} selectedId={selectedId} />
      ))}
    </div>
  );
};

export default Sidebar;