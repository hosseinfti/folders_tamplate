import styles from "./Sidebar.module.css";
import { initialTree } from './data';
import TreeNode from "./TreeNode";

export const Sidebar = () => {
  return (
    <div className={styles.wrapper}>
      {initialTree.map(node => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default Sidebar;