import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import PDFpage from "../about_MK/PDFpage";
import DocxViewer from "./DocxViewer";
import ImageViewer from "./ImageViewer";
import WebviewViewer from "./WebviewViewer";
import styles from "./ActivityDocuments.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const ActivityDocuments = () => {
    const { id } = useParams();
    
    const [types, setTypes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [sectionTitle, setSectionTitle] = useState("МЕТОДИЧЕСКИЙ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [pdfPath, setPdfPath] = useState(null);
    const [docxPath, setDocxPath] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [webviewUrl, setWebviewUrl] = useState(null);

    // Ссылка на DOM-элемент тултипа
    const tooltipRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [typesData, docsData, sectionsData] = await Promise.all([
                    methodicalService.getDocumentTypes(),
                    methodicalService.getDocumentsBySection(id),
                    methodicalService.getSections()
                ]);
                setTypes(typesData);
                setDocuments(docsData);

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

    // Функция показа тултипа (без ре-рендера)
    const showTooltip = (e, text) => {
        const el = tooltipRef.current;
        if (!el) return;

        // Сбрасываем прошлое состояние (если был перевёрнут)
        el.classList.remove(styles.tooltip_below);

        // Ставим текст и временно прячем для точных замеров
        el.textContent = text;
        el.style.opacity = "0";

        // Замеряем реальные размеры тултипа с текущим текстом
        const tw = el.offsetWidth;
        const th = el.offsetHeight;
        const cardRect = e.currentTarget.getBoundingClientRect();
        const margin = 16; // отступ от края экрана

        // ===== ГОРИЗОНТАЛЬ =====
        // Центр карточки по X
        let x = cardRect.left + cardRect.width / 2;
        // Не даем выйти за левый и правый край
        x = Math.max(tw / 2 + margin, Math.min(x, window.innerWidth - tw / 2 - margin));
        el.style.left = `${x}px`;

        // ===== ВЕРТИКАЛЬ =====
        // Хватает ли места сверху карточки?
        if (cardRect.top >= th + margin) {
            // Сверху достаточно места — показываем над карточкой
            el.style.top = `${cardRect.top}px`;
            el.style.transform = "translate(-50%, -100%) scale(1)";
        } else {
            // Сверху места нет — показываем ПОД карточкой
            el.style.top = `${cardRect.bottom}px`;
            el.style.transform = "translate(-50%, 0) scale(1)";
            el.classList.add(styles.tooltip_below); // переворачиваем стрелочку
        }

        el.style.opacity = "1";
    };

    // Функция скрытия
    const hideTooltip = () => {
        const el = tooltipRef.current;
        if (!el) return;
        el.style.opacity = "0";
        el.style.transform = "translate(-50%, -90%) scale(0.95)";
    };

    const handleOpen = (doc) => {
        if (!doc.file_path) {
            if (doc.external_url) {
                setWebviewUrl(doc.external_url);
            }
            return;
        }

        const fileName = (doc.file_name || "").toLowerCase();

        if (fileName.endsWith(".pdf")) {
            setPdfPath(doc.file_path);
        } else if (fileName.endsWith(".docx")) {
            setDocxPath(doc.file_path);
        } else if (IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
            setImagePath(doc.file_path);
        } else {
            alert("Этот формат документа пока нельзя открыть для просмотра. Обратитесь к администратору.");
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
                            <div 
                                className={styles.column_card} 
                                key={item.id}
                                onMouseEnter={(e) => showTooltip(e, item.title)}
                                onMouseLeave={hideTooltip}
                            >
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

    if (pdfPath) return <PDFpage path={pdfPath} onClose={() => setPdfPath(null)} />;
    if (docxPath) return <DocxViewer filePath={docxPath} onClose={() => setDocxPath(null)} />;
    if (imagePath) return <ImageViewer filePath={imagePath} onClose={() => setImagePath(null)} />;
    if (webviewUrl) return <WebviewViewer url={webviewUrl} onClose={() => setWebviewUrl(null)} />;

    return (
        <>
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

            {/* Единственный DOM-элемент тултипа */}
            <div ref={tooltipRef} className={styles.global_tooltip}></div>
        </>
    );
};

export default ActivityDocuments;