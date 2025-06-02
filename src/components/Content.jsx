import styles from "./Content.module.css";

export const Content = ({ path }) => {
  return <div className={styles.wrapper}>{path || 'Nothing selected'}</div>;
};

export default Content;
