import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import styles from "./DocxViewer.module.css";

const DocxViewer = ({ filePath, onClose }) => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const loadAndRender = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!window.electronAPI?.file?.read) {
                    throw new Error("IPC-метод file.read не найден. Перезапустите приложение.");
                }

                const result = await window.electronAPI.file.read(filePath);
                if (!result.success) {
                    throw new Error(result.error || "Не удалось прочитать файл");
                }

                if (cancelled || !containerRef.current) return;

                containerRef.current.innerHTML = "";

                await renderAsync(result.data, containerRef.current, undefined, {
                    className: "docx-preview-content",
                    inWrapper: true,
                    breakPages: true,
                    renderHeaders: true,
                    renderFooters: true,
                });
            } catch (e) {
                console.error("DocxViewer error:", e);
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (filePath) loadAndRender();

        return () => { cancelled = true; };
    }, [filePath]);

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button className={styles.closeBtn} onClick={onClose}>Закрыть</button>

                {loading && <div className={styles.status}>Загрузка документа...</div>}
                {error && <div className={styles.error}>Ошибка: {error}</div>}

                <div
                    ref={containerRef}
                    className={styles.docxContainer}
                    style={{ display: loading || error ? "none" : "block" }}
                />
            </div>
        </div>
    );
};

export default DocxViewer;