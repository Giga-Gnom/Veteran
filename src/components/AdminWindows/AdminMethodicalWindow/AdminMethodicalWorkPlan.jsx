import { useState } from "react";
import styles from "./AdminMethodicalWorkPlan.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import AdminMethodicalWorkPlanEditor from "./AdminMethodicalWorkPlanEditor";

const STUB_TABLES = [
    {
        id: 0,
        title: "План работы на 2025 год",
        columns: [
            { key: "event_name", label: "Мероприятие",  type: "string" },
            { key: "event_date", label: "Дата",         type: "date" },
            { key: "responsible", label: "Ответственный", type: "string" },
            { key: "count",      label: "Участников",   type: "number" }
        ],
        rows: [
            { id: 0, data: { event_name: "Семинар для ветеранов", event_date: "2025-03-12", responsible: "Иванов И.И.", count: 25 } },
            { id: 1, data: { event_name: "Круглый стол", event_date: "2025-04-05", responsible: "Петрова А.С.", count: 15 } }
        ]
    },
    {
        id: 1,
        title: "План патриотических мероприятий",
        columns: [
            { key: "title", label: "Название", type: "string" },
            { key: "date",  label: "Дата",     type: "date" },
            { key: "place", label: "Место",    type: "string" }
        ],
        rows: [
            { id: 0, data: { title: "Урок мужества", date: "2025-05-09", place: "Школа №12" } }
        ]
    }
]

const AdminMethodicalWorkPlan = () => {
    const [tables, setTables] = useState(STUB_TABLES)
    const [selectedTable, setSelectedTable] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    const handleOpenAdd = () => {
        setNewTitle("")
        setShowAddModal(true)
    }

    const handleCloseAdd = () => {
        setNewTitle("")
        setShowAddModal(false)
    }

    const handleAddTable = () => {
        if (!newTitle.trim()) {
            showError("Введите название таблицы")
            return
        }
        setTables(prev => [
            ...prev,
            { id: Date.now(), title: newTitle.trim(), columns: [], rows: [] }
        ])
        handleCloseAdd()
        showAlert("Таблица создана")
    }

    const handleDeleteTable = async (table) => {
        const confirmed = await showConfirm(`Удалить таблицу "${table.title}"?`)
        if (!confirmed) return
        setTables(prev => prev.filter(t => t.id !== table.id))
        if (selectedTable?.id === table.id) setSelectedTable(null)
    }

    const handleUpdateTable = (updated) => {
        setTables(prev => prev.map(t => t.id === updated.id ? updated : t))
        setSelectedTable(updated)
    }

    if (selectedTable) {
        return (
            <>
                {error && <ErrorMassage message={error} onClose={clearError}/>}
                <AdminMethodicalWorkPlanEditor
                    table={selectedTable}
                    onBack={() => setSelectedTable(null)}
                    onChange={handleUpdateTable}
                    showError={showError}
                />
            </>
        )
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>План работы</h3>
                <button className={common.add_table_btn} onClick={handleOpenAdd}>
                    + Добавить таблицу
                </button>
            </div>

            {tables.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>📋</div>
                    <p>Таблиц пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первую таблицу
                    </button>
                </div>
            ) : (
                <div className={styles.tables_grid}>
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={styles.table_card}
                            onClick={() => setSelectedTable(table)}
                        >
                            <div className={styles.table_header}>
                                <h4 className={styles.table_title}>{table.title}</h4>
                                <button
                                    className={common.delete_btn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteTable(table)
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                            <div className={styles.table_meta}>
                                <span>{table.columns.length} колонок</span>
                                <span>·</span>
                                <span>{table.rows.length} строк</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className={common.modal_overlay} onClick={handleCloseAdd}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Новая таблица</h3>
                        <div className={common.form_group}>
                            <label htmlFor="tableTitle">Название таблицы *</label>
                            <input
                                id="tableTitle"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Например: План работы на 2025 год"
                                autoFocus
                            />
                        </div>
                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseAdd}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleAddTable}>Создать</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMethodicalWorkPlan