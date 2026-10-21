import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import styles from "./ActivityPartners.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const ActivityPartners = () => {
    const { id } = useParams();
    
    const [partners, setPartners] = useState([]);
    const [sectionTitle, setSectionTitle] = useState("МЕТОДИЧЕСКИЙ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Загружаем партнёров и список разделов параллельно
                const [partnersData, sectionsData] = await Promise.all([
                    methodicalService.getPartnersBySection(id),
                    methodicalService.getSections()
                ]);
                
                setPartners(partnersData);

                // Находим текущий раздел и ставим его название
                const currentSection = sectionsData.find(s => String(s.id) === String(id));
                if (currentSection) {
                    setSectionTitle(currentSection.title.toUpperCase());
                }
            } catch (err) {
                console.error("Ошибка загрузки партнёров:", err);
                setError("Не удалось загрузить партнёров");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

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
                ) : partners.length === 0 ? (
                    <div className={styles.status}>Партнёров пока нет</div>
                ) : (
                    partners.map((partner) => (
                        <div className={styles.column_card} key={partner.id}>
                            <span className={styles.partner_name}>{partner.name}</span>
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
    );
};

export default ActivityPartners;