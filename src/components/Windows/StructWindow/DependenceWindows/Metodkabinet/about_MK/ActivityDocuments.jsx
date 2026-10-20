import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import PDFpage from "../about_MK/PDFpage";
import styles from "./ActivityDocuments.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const ActivityDocuments = () => {
    const { id } = useParams();
    
    const [types, setTypes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [pdfPath, setPdfPath] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [typesData, docsData] = await Promise.all([
                    methodicalService.getDocumentTypes(),
                    methodicalService.getDocumentsBySection(id)
                ]);
                setTypes(typesData);
                setDocuments(docsData);
            } catch (err) {
                console.error("Ошибка загрузки документов:", err);
                setError("Не удалось загрузить документы");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    const handleOpen = (doc) => {
        if (doc.file_path) {
            if (doc.file_name?.toLowerCase().endsWith('.pdf')) {
                setPdfPath(doc.file_path);
            } else {
                window.open(doc.file_path, "_blank", "noopener,noreferrer");
            }
        } else if (doc.external_url) {
            window.open(doc.external_url, "_blank", "noopener,noreferrer");
        }
    };

    const ActivityColumn = ({ title, typeId }) => {
        const items = documents.filter(d => d.doc_type_id === typeId);

        return (
            <div className={styles.contant_column}>
                <div className={styles.column_title}>{title}</div>
                <div className={styles.column_list}>
                    {items.length === 0 ? (
                        <div className={styles.empty}>Документов нет</div>
                    ) : (
                        items.map((item) => (
                            <div className={styles.column_card} key={item.id}>
                                <div className={styles.card_name}>{item.title}</div>
                                
                                <button 
                                    className={styles.card_button} 
                                    onClick={() => handleOpen(item)}
                                >
                                    Открыть
                                </button>
                                
                                {item.file_name ? (
                                    <div className={styles.card_url}>📄 {item.file_name}</div>
                                ) : item.external_url ? (
                                    <div className={styles.card_url}>🔗 Внешняя ссылка</div>
                                ) : null}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (pdfPath) {
        return <PDFpage path={pdfPath} onClose={() => setPdfPath(null)} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ" />
            </div>

            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : (
                    <>
                        <ActivityColumn title="Нормативно-правовые документы" typeId={1} />
                        <ActivityColumn title="Методические рекомендации"     typeId={2} />
                        <ActivityColumn title="Пособия, памятки"              typeId={3} />
                    </>
                )}
            </div>

            <div className={styles.container_button}>
                <Link to={`/metodkabinet/activity/${id}`}>
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default ActivityDocuments;