import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./WorkPlansPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import PDFpage from "./PDFpage"; // Укажите правильный путь к PDFpage
import DocxViewer from "./DocxViewer"; // Укажите правильный путь к DocxViewer
import ImageViewer from "./ImageViewer"; // Укажите правильный путь к ImageViewer
import methodicalService from "../../../../../../services/methodicalService";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const WorkPlansPage = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Вьюверы для файлов
    const [pdfPath, setPdfPath] = useState(null);
    const [docxPath, setDocxPath] = useState(null);
    const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await methodicalService.getWorkPlans();
                setPlans(data);
            } catch (err) {
                console.error("Ошибка загрузки планов:", err);
                setError("Не удалось загрузить планы");
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handleOpenPlan = (plan) => {
        if (plan.plan_type === 'file') {
            const fileName = (plan.file_name || "").toLowerCase();
            if (fileName.endsWith(".pdf")) {
                setPdfPath(plan.file_path);
            } else if (fileName.endsWith(".docx")) {
                setDocxPath(plan.file_path);
            } else if (IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
                setImagePath(plan.file_path);
            } else {
                alert("Этот формат плана нельзя открыть для просмотра. Обратитесь к администратору.");
            }
        } else {
            // Если это таблица — переходим на страницу просмотра
            navigate(`/metodkabinet/plans/${plan.id}`);
        }
    };

    if (pdfPath) return <PDFpage path={pdfPath} onClose={() => setPdfPath(null)} />;
    if (docxPath) return <DocxViewer filePath={docxPath} onClose={() => setDocxPath(null)} />;
    if (imagePath) return <ImageViewer filePath={imagePath} onClose={() => setImagePath(null)} />;

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="ПЛАН РАБОТЫ" />
            </div>

            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : plans.length === 0 ? (
                    <div className={styles.status}>Планов пока нет</div>
                ) : (
                    plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={styles.column_card} 
                            onClick={() => handleOpenPlan(plan)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className={styles.plan_title}>
                                {plan.plan_type === 'file' ? '📄 ' : '📊 '} 
                                {plan.title}
                            </span>
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

export default WorkPlansPage;