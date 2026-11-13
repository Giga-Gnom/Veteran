import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import WebviewViewer from "./WebviewViewer"; // Убедитесь, что путь до WebviewViewer правильный!
import styles from "./ActivityPartners.module.css";
import methodicalService from "../../../../../../services/methodicalService";

const ActivityPartners = () => {
    const { id } = useParams();
    
    const [partners, setPartners] = useState([]);
    const [sectionTitle, setSectionTitle] = useState("МЕТОДИЧЕСКИЙ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояние для открытия сайта
    const [webviewUrl, setWebviewUrl] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [partnersData, sectionsData] = await Promise.all([
                    methodicalService.getPartnersBySection(id),
                    methodicalService.getSections()
                ]);
                
                setPartners(partnersData);

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

    // Если открыт сайт — показываем его поверх всего
    if (webviewUrl) {
        return <WebviewViewer url={webviewUrl} onClose={() => setWebviewUrl(null)} />;
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
                ) : partners.length === 0 ? (
                    <div className={styles.status}>Партнёров пока нет</div>
                ) : (
                    partners.map((partner) => (
                        <div 
                            className={styles.column_card} 
                            key={partner.id}
                            onClick={() => {
                                if (partner.external_url) {
                                    setWebviewUrl(partner.external_url);
                                }
                            }}
                            style={{ cursor: partner.external_url ? 'pointer' : 'default' }}
                        >
                            <span className={styles.partner_name}>{partner.name}</span>
                            {partner.external_url && (
                                <span className={styles.partner_link_hint}>🔗 Перейти на сайт</span>
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
    );
};

export default ActivityPartners;