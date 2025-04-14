import styles from "./ImageModal.module.css";

export default function ImageModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div>
        <img src={imageUrl} />
        <button onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
