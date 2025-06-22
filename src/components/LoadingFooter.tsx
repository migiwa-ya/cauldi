import React from "react";
import styles from "./LoadingFooter.module.css";

interface Props {
  loading?: boolean;
}

const LoadingFooter: React.FC<Props> = ({ loading = false }) => {
  if (!loading) {
    return null;
  }
  return (
    <div className={styles.loadingFooter}>
      <div className={styles.spinner} />
    </div>
  );
};

export default LoadingFooter;