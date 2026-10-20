import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import styles from "./AreaActivityPage.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const AreaActivityPage = () => {
    const { id } = useParams();
    
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={section.title.toUpperCase()} />
            </div>

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

            <div className={styles.images}>
                
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