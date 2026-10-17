import { useState } from "react";
import styles from "./AdminMethodicalWindow.module.css";
import AdminMethodicalWorkPlan from "./AdminMethodicalWorkPlan";
import AdminMethodicalLectures from "./AdminMethodicalLectures";
import AdminMethodicalSections from "./AdminMethodicalSections";

const TABS = [
    { id: "plan",      label: "План работы" },
    { id: "lectures",  label: "Лекторская группа" },
    { id: "methodical", label: "Методическое сопровождение" }
]

const AdminMethodicalWindow = () => {
    const [activeTab, setActiveTab] = useState("plan")

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <h2 className={styles.window_title}>Методический отдел</h2>
                <p className={styles.window_subtitle}>
                    Управление планом работы, лекциями и методическим сопровождением
                </p>
            </div>

            <div className={styles.tabs}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tab_btn} ${activeTab === tab.id ? styles.active : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.container_content}>
                {activeTab === "plan" && <AdminMethodicalWorkPlan />}
                {activeTab === "lectures" && <AdminMethodicalLectures />}
                {activeTab === "methodical" && <AdminMethodicalSections />}
            </div>
        </div>
    )
}

export default AdminMethodicalWindow