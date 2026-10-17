import { useEffect, useState } from "react";
import styles from "./AdminMethodicalSectionDetail.module.css";
import common from "./AdminMethodicalCommon.module.css";
import AdminSectionDocuments from "./AdminSectionDocuments";
import AdminSectionPartners from "./AdminSectionPartners";
import AdminSectionResults from "./AdminSectionResults";
import methodicalService from "../../../services/methodicalService";

const TABS = [
    { id: "documents", label: "Документы" },
    { id: "partners",  label: "Партнёры" },
    { id: "results",   label: "Итоги работы" }
]

const AdminMethodicalSectionDetail = ({ section, onBack }) => {
    const [activeTab, setActiveTab] = useState("documents")
    const [counts, setCounts] = useState({
        documents: section.documents_count ?? 0,
        partners: section.partners_count ?? 0,
        results: section.results_count ?? 0
    })

    const refreshCounts = async () => {
        const list = await methodicalService.getSectionsWithCounts()
        const fresh = list.find(s => s.id === section.id)
        if (fresh) {
            setCounts({
                documents: fresh.documents_count,
                partners: fresh.partners_count,
                results: fresh.results_count
            })
        }
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
                {activeTab === "documents" && (
                    <AdminSectionDocuments sectionId={section.id} onChanged={refreshCounts}/>
                )}
                {activeTab === "partners" && (
                    <AdminSectionPartners sectionId={section.id} onChanged={refreshCounts}/>
                )}
                {activeTab === "results" && (
                    <AdminSectionResults sectionId={section.id} onChanged={refreshCounts}/>
                )}
            </div>
        </div>
    )
}

export default AdminMethodicalSectionDetail