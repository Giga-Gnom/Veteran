import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LecturesMKPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import PDFpage from "../about_MK/PDFpage";
import DocxViewer from "./DocxViewer";
import ImageViewer from "./ImageViewer";
import methodicalService from "../../../../../../services/methodicalService";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const LecturesMKPage = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pdfPath, setPdfPath] = useState(null);
    const [docxPath, setDocxPath] = useState(null);
    const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
        const loadLectures = async () => {
            try {
                setLoading(true);
                const data = await methodicalService.getLectures();
                setLectures(data);
            } catch (err) {
                console.error("Ошибка загрузки лекций:", err);
                setError("Не удалось загрузить лекции");
            } finally {
                setLoading(false);
            }
        };

        loadLectures();
    }, []);

    // ========== Открытие на клиенте (только для чтения) ==========
    const handleOpen = (lecture) => {
        if (!lecture.file_path) {
            if (lecture.external_url) {
                window.open(lecture.external_url, "_blank", "noopener,noreferrer");
            }
            return;
        }

        const fileName = (lecture.file_name || "").toLowerCase();

        if (fileName.endsWith(".pdf")) {
            setPdfPath(lecture.file_path);
        } else if (fileName.endsWith(".docx")) {
            setDocxPath(lecture.file_path);
        } else if (IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
            setImagePath(lecture.file_path);
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

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="ЛЕКЦИОННЫЙ МАТЕРИАЛ МЕТОДИЧЕСКОГО КАБИНЕТА МГСВ" />
            </div>
        
            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : lectures.length === 0 ? (
                    <div className={styles.status}>Лекций пока нет</div>
                ) : (
                    lectures.map((lecture) => (
                        <div 
                            className={styles.column_card} 
                            key={lecture.id}
                            onClick={() => handleOpen(lecture)}
                            style={{ cursor: (lecture.file_path || lecture.external_url) ? 'pointer' : 'default' }}
                        >
                            <div className={styles.card_content}>
                                <span className={styles.lecture_title}>{lecture.title}</span>
                                {lecture.file_name && (
                                    <span className={styles.lecture_meta}>📄 {lecture.file_name}</span>
                                )}
                                {!lecture.file_name && lecture.external_url && (
                                    <span className={styles.lecture_meta}>🔗 Внешняя ссылка</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        
            <div className={styles.container_button}>
                <Link to="/metodkabinet">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default LecturesMKPage;