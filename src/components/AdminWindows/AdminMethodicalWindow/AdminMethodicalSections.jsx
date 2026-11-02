import { useEffect, useState } from "react";
import styles from "./AdminMethodicalSections.module.css";
import common from "./AdminMethodicalCommon.module.css";
import AdminMethodicalSectionDetail from "./AdminMethodicalSectionDetail";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import methodicalService from "../../../services/methodicalService";

const AdminMethodicalSections = () => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const showError = (m) => setError(m);
    const clearError = () => setError(null);

    const loadSections = async () => {
        try {
            setLoading(true);
            const data = await methodicalService.getSectionsWithCounts();
            setSections(data);
        } catch (e) {
            console.error(e);
            showError("Не удалось загрузить разделы");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSections(); }, []);

    // Приходит из детальной страницы после добавления/удаления
    const handleSectionChanged = (fresh) => {
        setSections(prev => prev.map(s => s.id === fresh.id ? fresh : s));
        setSelectedSection(fresh);
    };

    const handleBack = async () => {
        setSelectedSection(null);
        // На всякий случай перечитываем — если что-то менялось вне onChanged
        await loadSections();
    };

    if (selectedSection) {
        return (
            <AdminMethodicalSectionDetail
                section={selectedSection}
                onBack={handleBack}
                onChanged={handleSectionChanged}
            />
        );
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError} />}

            <div className={common.section_header}>
                <h3 className={common.section_title}>Методическое сопровождение</h3>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : sections.length === 0 ? (
                <div className={common.empty_state}><p>Разделов пока нет</p></div>
            ) : (
                <div className={styles.sections_grid}>
                    {sections.map(section => (
                        <div
                            key={section.id}
                            className={styles.section_card}
                            onClick={() => setSelectedSection(section)}
                        >
                            <h4 className={styles.section_card_title}>{section.title}</h4>
                            <div className={styles.section_card_stats}>
                                <div className={styles.stat_row}>
                                    <span className={styles.stat_label}>Документы:</span>
                                    <span className={styles.stat_value}>{section.documents_count ?? 0}</span>
                                </div>
                                <div className={styles.stat_row}>
                                    <span className={styles.stat_label}>Партнёры:</span>
                                    <span className={styles.stat_value}>{section.partners_count ?? 0}</span>
                                </div>
                                <div className={styles.stat_row}>
                                    <span className={styles.stat_label}>Итоги:</span>
                                    <span className={styles.stat_value}>{section.results_count ?? 0}</span>
                                </div>
                            </div>
                            <button className={styles.open_section_btn}>Открыть раздел</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMethodicalSections;