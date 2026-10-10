import React from "react";
import styles from "./PDFpage.module.css"

const PDFpage = ({ path, onClose }) => {

    return (
        <div className={styles.documentContainer}>
            <iframe src={path} className={styles.iframe} type="application/pdf"></iframe>
            <button onClick={onClose} className={styles.closeButton}>
                Закрыть
            </button>
        </div>
    );
};

export default PDFpage;