import styles from "./ImageViewer.module.css";

const ImageViewer = ({ filePath, onClose }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button className={styles.closeBtn} onClick={onClose}>Закрыть</button>
                <img src={filePath} alt="Документ" className={styles.image} />
            </div>
        </div>
    );
};

export default ImageViewer;