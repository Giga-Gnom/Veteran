import React from "react";
import styles from "./NewspapersDoc.module.css"

const NewspapersDoc = ({ path, onClose }) => {

    const getPdfUrl = (url) => {
        if(url.toLowerCase().endsWith('pdf')) {
            return `${url}#toolbar=0&navpanes=0`;
        }
        return url
    }

    return (
        <div className={styles.documentContainer}>
            <iframe src={getPdfUrl(path)} className={styles.iframe} type="application/pdf"></iframe>
            <button onClick={onClose} className={styles.closeButton}>
                Закрыть
            </button>
        </div>
    );
};

export default NewspapersDoc;