import React from "react";
import styles from "./RegionDocumebt.module.css";

const RegionDocument = ({ path, onClose }) => {
    return (
        <div className={styles.documentContainer}>
            <iframe src={path} className={styles.iframe}></iframe>
            <button onClick={onClose} className={styles.closeButton}>
                Закрыть
            </button>
        </div>
    );
};

export default RegionDocument;