import { useState } from "react";
import styles from "./AdminMethodicalSections.module.css";
import common from "./AdminMethodicalCommon.module.css";
import AdminMethodicalSectionDetail from "./AdminMethodicalSectionDetail";

const STUB_SECTIONS = [
    {
        id: 1,
        code: "social_protection",
        title: "Социальная защита ветеранов и пенсионеров",
        documents: [
            { id: 0, doc_type: "normative", title: "ФЗ № 5-ФЗ «О ветеранах»", external_url: null, file: { original_name: "fz-5.pdf", mime_type: "application/pdf", url: "#" } },
            { id: 1, doc_type: "recommendations", title: "Методические рекомендации по работе с ветеранами", external_url: null, file: { original_name: "rec.docx", mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", url: "#" } }
        ],
        partners: [
            { id: 0, name: "Городской совет ветеранов" },
            { id: 1, name: "Фонд «Забота»" }
        ],
        results: [
            { id: 0, title: "Отчёт за I квартал 2025", external_url: null, file: { original_name: "report.pdf", mime_type: "application/pdf", url: "#" } }
        ]
    },
    {
        id: 2,
        code: "patriotic_education",
        title: "Патриотическое воспитание молодежи",
        documents: [], partners: [], results: []
    },
    {
        id: 3,
        code: "org_planning",
        title: "Организационно-плановая работа",
        documents: [], partners: [], results: []
    },
    {
        id: 4,
        code: "cultural_planning",
        title: "Культурно-плановая работа",
        documents: [], partners: [], results: []
    },
    {
        id: 5,
        code: "info_analytical",
        title: "Информационно-аналитическая работа",
        documents: [], partners: [], results: []
    }
]

const AdminMethodicalSections = () => {
    const [sections, setSections] = useState(STUB_SECTIONS)
    const [selectedSection, setSelectedSection] = useState(null)

    const handleUpdateSection = (updated) => {
        setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
        setSelectedSection(updated)
    }

    if (selectedSection) {
        return (
            <AdminMethodicalSectionDetail
                section={selectedSection}
                onBack={() => setSelectedSection(null)}
                onChange={handleUpdateSection}
            />
        )
    }

    return (
        <div>
            <div className={common.section_header}>
                <h3 className={common.section_title}>Методическое сопровождение</h3>
            </div>

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
                                <span className={styles.stat_value}>{section.documents.length}</span>
                            </div>
                            <div className={styles.stat_row}>
                                <span className={styles.stat_label}>Партнёры:</span>
                                <span className={styles.stat_value}>{section.partners.length}</span>
                            </div>
                            <div className={styles.stat_row}>
                                <span className={styles.stat_label}>Итоги:</span>
                                <span className={styles.stat_value}>{section.results.length}</span>
                            </div>
                        </div>
                        <button className={styles.open_section_btn}>Открыть раздел</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminMethodicalSections