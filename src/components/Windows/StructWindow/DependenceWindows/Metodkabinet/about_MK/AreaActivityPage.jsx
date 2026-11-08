import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import ImageViewer from "./ImageViewer"; // Подключаем ваш просмотрщик картинок
import { imgsarr } from "../srcMK/imgsarray"; // Путь к файлу с картинками
import styles from "./AreaActivityPage.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const AreaActivityPage = () => {
    const { id } = useParams();
    
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояние для открытой картинки (лайтбокс)
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        const loadSection = async () => {
            try {
                setLoading(true);
                const allSections = await methodicalService.getSectionsWithCounts();
                const current = allSections.find(s => String(s.id) === String(id));
                
                if (current) {
                    setSection(current);
                } else {
                    setError("Раздел не найден");
                }
            } catch (err) {
                console.error("Ошибка загрузки раздела:", err);
                setError("Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadSection();
    }, [id]);

    // Если открыта картинка — показываем её на весь экран
    if (activeImage) {
        return <ImageViewer filePath={activeImage} onClose={() => setActiveImage(null)} />;
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.container_head}>
                    <MyHat heading="МЕТОДИЧЕСКИЙ" />
                </div>
                <div className={styles.status}>Загрузка...</div>
            </div>
        );
    }

    if (error || !section) {
        return (
            <div className={styles.container}>
                <div className={styles.container_head}>
                    <MyHat heading="МЕТОДИЧЕСКИЙ" />
                </div>
                <div className={styles.status} style={{ color: 'red' }}>{error || "Раздел не найден"}</div>
                <div className={styles.container_button}>
                    <Link to="/metodkabinet">
                        <BeforePageButton />
                    </Link>
                </div>
            </div>
        );
    }

    // Получаем картинки для текущего раздела по ID
    const currentImages = imgsarr.find(item => item.id === Number(id))?.arr || [];

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={section.title.toUpperCase()} />
            </div>

            {/* ТРИ КНОПКИ (оставили без изменений) */}
            <div className={styles.container_contant}>
                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/documents`}
                        className={styles.column_card}
                    >
                        <span className={styles.card_title}>
                            Нормативно-правовые документы, методические рекомендации, пособия, памятки
                        </span>
                        {section.documents_count !== undefined && (
                            <span className={styles.card_count}>{section.documents_count} материалов</span>
                        )}
                    </Link>
                </div>

                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/partners`}
                        className={styles.column_card}
                    >
                        <span className={styles.card_title}>Партнёры</span>
                        {section.partners_count !== undefined && (
                            <span className={styles.card_count}>{section.partners_count} организаций</span>
                        )}
                    </Link>
                </div>

                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/results`}
                        className={styles.column_card}
                    >
                        <span className={styles.card_title}>Итоги работы, результаты</span>
                        {section.results_count !== undefined && (
                            <span className={styles.card_count}>{section.results_count} записей</span>
                        )}
                    </Link>
                </div>
            </div>

            {/* ГАЛЕРЕЯ КАРТИНОК */}
            <div className={styles.images}>
                {currentImages.length === 0 ? (
                    <div className={styles.no_images}>Фотографий пока нет</div>
                ) : (
                    <div className={styles.gallery_grid}>
                        {currentImages.map((img, index) => (
                            <div 
                                key={index} 
                                className={styles.image_wrapper}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={img} alt={`Фото ${index + 1}`} className={styles.gallery_img} />
                                <div className={styles.image_overlay}>
                                    <span>Открыть</span>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default AreaActivityPage;