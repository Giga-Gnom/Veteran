import React from "react";
import styles from "./StandartDoc.module.css"

const StandartDoc = ({ path, onClose }) => {
    return (
        <div className={styles.documentContainer}>
            <iframe src={path} className={styles.iframe}></iframe>
            <button onClick={onClose} className={styles.closeButton}>
                Закрыть
            </button>
        </div>
    );
};

export default StandartDoc;