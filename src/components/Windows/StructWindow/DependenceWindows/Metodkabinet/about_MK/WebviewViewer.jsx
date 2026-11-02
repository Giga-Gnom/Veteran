import { useRef } from "react";
import styles from "./WebviewViewer.module.css";

const WebviewViewer = ({ url, onClose }) => {
    const webviewRef = useRef(null);

    return (
        <div className={styles.webviewContainer}>
            <div className={styles.navPanel}>
                <button className={styles.backButton} onClick={onClose}>
                    ← Вернуться к приложению
                </button>
                <span className={styles.urlLabel} title={url}>{url}</span>
            </div>
            <webview
                ref={webviewRef}
                src={url}
                className={styles.webview}
                nodeintegration={false}
                webpreferences="contextIsolation=true"
            />
        </div>
    );
};

export default WebviewViewer;