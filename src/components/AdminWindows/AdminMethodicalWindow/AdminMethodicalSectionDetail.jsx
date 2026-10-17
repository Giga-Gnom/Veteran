import { useState } from "react";
import styles from "./AdminMethodicalSectionDetail.module.css";
import common from "./AdminMethodicalCommon.module.css";
import AdminSectionDocuments from "./AdminSectionDocuments";
import AdminSectionPartners from "./AdminSectionPartners";
import AdminSectionResults from "./AdminSectionResults";

const TABS = [
    { id: "documents", label: "Документы" },
    { id: "partners",  label: "Партнёры" },
    { id: "results",   label: "Итоги работы" }
]

const AdminMethodicalSectionDetail = ({ section, onBack, onChange }) => {
    const [activeTab, setActiveTab] = useState("documents")

    const counts = {
        documents: section.documents.length,
        partners: section.partners.length,
        results: section.results.length
    }

    return (
        <div>
            <div className={common.section_header}>
                <div className={common.header_left}>
                    <button className={common.back_btn} onClick={onBack}>← Назад к разделам</button>
                    <h3 className={common.section_title}>{section.title}</h3>
                </div>
            </div>

            <div className={styles.tabs}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab_btn} ${activeTab === tab.id ? styles.active : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        <span className={styles.tab_count}>{counts[tab.id]}</span>
                    </button>
                ))}
            </div>

            <div className={styles.tab_content}>
                {activeTab === "documents" && <AdminSectionDocuments section={section} onChange={onChange}/>}
                {activeTab === "partners" && <AdminSectionPartners section={section} onChange={onChange}/>}
                {activeTab === "results" && <AdminSectionResults section={section} onChange={onChange}/>}
            </div>
        </div>
    )
}

export default AdminMethodicalSectionDetail