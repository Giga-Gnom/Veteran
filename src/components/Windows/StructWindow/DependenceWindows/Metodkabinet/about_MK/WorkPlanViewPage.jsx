import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./WorkPlanViewPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import methodicalService from "../../../../../../services/methodicalService";

// Подключаем вьюеры (проверьте правильность путей до них в вашей структуре папок)
import PDFpage from "../about_MK/PDFpage"; 
import DocxViewer from "./DocxViewer"; // Если они лежат в другой папке, поправьте путь (например, ../../DocxViewer)
import ImageViewer from "./ImageViewer";
import WebviewViewer from "./WebviewViewer";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const WorkPlanViewPage = () => {
    const { id } = useParams();
    
    const [plan, setPlan] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для вьюеров
    const [pdfPath, setPdfPath] = useState(null);
    const [docxPath, setDocxPath] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [webviewUrl, setWebviewUrl] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const planData = await methodicalService.getWorkPlanById(id);
                if (!planData) {
                    setError("Таблица не найдена");
                    return;
                }
                setPlan(planData);
                
                const rowsData = await methodicalService.getPlanRows(id);
                setRows(rowsData);
            } catch (err) {
                console.error("Ошибка загрузки таблицы:", err);
                setError("Не удалось загрузить таблицу");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    // Открытие файла (только для чтения)
    const handleOpenFile = (fileData) => {
        if (!fileData || !fileData.path) return;
        const path = fileData.path;
        const fileName = (fileData.name || "").toLowerCase();

        if (fileName.endsWith(".pdf")) {
            setPdfPath(path);
        } else if (fileName.endsWith(".docx")) {
            setDocxPath(path);
        } else if (IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
            setImagePath(path);
        } else {
            // Для txt и других форматов используем webview
            setWebviewUrl(path);
        }
    };

    // Рендер ячейки с файлом
    const renderFileCell = (value) => {
        if (!value) return "—";
        try {
            const fileData = JSON.parse(value);
            return (
                <span 
                    className={styles.file_link} 
                    onClick={() => handleOpenFile(fileData)}
                    title="Открыть файл (только чтение)"
                >
                    📄 {fileData.name || "Файл"}
                </span>
            );
        } catch {
            // Если данные в старом формате (просто строка)
            return (
                <span 
                    className={styles.file_link} 
                    onClick={() => handleOpenFile({ name: value, path: value })}
                >
                    📄 {value}
                </span>
            );
        }
    };

    // Рендер остальных ячеек
    const renderCell = (value, colType) => {
        if (value === null || value === undefined || value === "") {
            return "—";
        }
        if (colType === "boolean") {
            return value ? "Да" : "Нет";
        }
        return String(value);
    };

    // ===== Отрисовка вьюеров =====
    if (pdfPath) return <PDFpage path={pdfPath} onClose={() => setPdfPath(null)} />;
    if (docxPath) return <DocxViewer filePath={docxPath} onClose={() => setDocxPath(null)} />;
    if (imagePath) return <ImageViewer filePath={imagePath} onClose={() => setImagePath(null)} />;
    if (webviewUrl) return <WebviewViewer url={webviewUrl} onClose={() => setWebviewUrl(null)} />;

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={plan ? plan.title.toUpperCase() : "ПЛАН РАБОТЫ"} />
            </div>

            <div className={styles.table_wrapper}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : plan ? (
                    plan.columns.length === 0 ? (
                        <div className={styles.status}>В этой таблице нет колонок</div>
                    ) : (
                        <div className={styles.table_scroll}>
                            <table className={styles.view_table}>
                                <thead>
                                    <tr>
                                        {plan.columns.map((col) => (
                                            <th key={col.key}>{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={plan.columns.length} className={styles.empty}>
                                                Строк пока нет
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row) => (
                                            <tr key={row.id}>
                                                {plan.columns.map((col) => (
                                                    <td key={col.key}>
                                                        {col.type === "file" 
                                                            ? renderFileCell(row.data[col.key])
                                                            : renderCell(row.data[col.key], col.type)
                                                        }
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : null}
            </div>

            <div className={styles.container_button}>
                <Link to="/metodkabinet/plans">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default WorkPlanViewPage;