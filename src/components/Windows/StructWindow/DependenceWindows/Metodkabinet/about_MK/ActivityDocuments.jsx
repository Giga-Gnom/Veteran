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
    const [sectionTitle, setSectionTitle] = useState("МЕТОДИЧЕСКИЙ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [pdfPath, setPdfPath] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Загружаем типы, документы и разделы параллельно
                const [typesData, docsData, sectionsData] = await Promise.all([
                    methodicalService.getDocumentTypes(),
                    methodicalService.getDocumentsBySection(id),
                    methodicalService.getSections()
                ]);
                setTypes(typesData);
                setDocuments(docsData);

                // Ищем текущий раздел и ставим заголовок
                const currentSection = sectionsData.find(s => String(s.id) === String(id));
                if (currentSection) {
                    setSectionTitle(currentSection.title.toUpperCase());
                }
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
                <MyHat heading={sectionTitle} />
            </div>

            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : (
                    <>
                        <ActivityColumn 
                            title="Нормативно-правовые документы" 
                            typeId={types.find(t => t.code === 'normative')?.id} 
                        />
                        <ActivityColumn 
                            title="Методические рекомендации" 
                            typeId={types.find(t => t.code === 'recommendations')?.id} 
                        />
                        <ActivityColumn 
                            title="Пособия, памятки" 
                            typeId={types.find(t => t.code === 'manuals')?.id} 
                        />
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