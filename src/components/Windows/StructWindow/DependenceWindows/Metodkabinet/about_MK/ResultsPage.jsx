import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ResultsPage.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import PDFpage from "../about_MK/PDFpage";
import DocxViewer from "./DocxViewer";
import ImageViewer from "./ImageViewer";
import methodicalService from "../../../../../../services/methodicalService";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const ResultsPage = () => {
    const { id } = useParams(); 
    
    const [results, setResults] = useState([]);
    const [sectionTitle, setSectionTitle] = useState("МЕТОДИЧЕСКИЙ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pdfPath, setPdfPath] = useState(null);
    const [docxPath, setDocxPath] = useState(null);
    const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                const [resultsData, sectionsData] = await Promise.all([
                    methodicalService.getResultsBySection(id),
                    methodicalService.getSections()
                ]);
                
                setResults(resultsData);
                
                const currentSection = sectionsData.find(s => String(s.id) === String(id));
                if (currentSection) {
                    setSectionTitle(currentSection.title.toUpperCase());
                }
                
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                setError("Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    // ========== Открытие на клиенте (только для чтения) ==========
    const handleOpen = (item) => {
        if (!item.file_path) {
            if (item.external_url) {
                window.open(item.external_url, "_blank", "noopener,noreferrer");
            }
            return;
        }

        const fileName = (item.file_name || "").toLowerCase();

        if (fileName.endsWith(".pdf")) {
            setPdfPath(item.file_path);
        } else if (fileName.endsWith(".docx")) {
            setDocxPath(item.file_path);
        } else if (IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
            setImagePath(item.file_path);
        } else {
            alert("Этот формат документа пока нельзя открыть для просмотра. Обратитесь к администратору.");
        }
    };

    if (pdfPath) {
        return <PDFpage path={pdfPath} onClose={() => setPdfPath(null)} />;
    }

    if (docxPath) {
        return <DocxViewer filePath={docxPath} onClose={() => setDocxPath(null)} />;
    }

    if (imagePath) {
        return <ImageViewer filePath={imagePath} onClose={() => setImagePath(null)} />;
    }

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={sectionTitle} />
            </div>
        
            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status_message}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status_message} style={{ color: 'red' }}>{error}</div>
                ) : results.length === 0 ? (
                    <div className={styles.status_message}>Итогов работы пока нет</div>
                ) : (
                    results.map((item) => (
                        <div 
                            key={item.id} 
                            className={styles.column_card}
                            onClick={() => handleOpen(item)}
                            style={{ cursor: (item.external_url || item.file_path) ? 'pointer' : 'default' }}
                        >
                            <span className={styles.card_title}>{item.title}</span>
                            {item.file_name && (
                                <span className={styles.card_file_hint}>📄 {item.file_name}</span>
                            )}
                            {!item.file_name && item.external_url && (
                                <span className={styles.card_file_hint}>🔗 Внешняя ссылка</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        
            <div className={styles.container_button}>
                <Link to={`/metodkabinet/activity/${id}`}>
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    )
}

export default ResultsPage;