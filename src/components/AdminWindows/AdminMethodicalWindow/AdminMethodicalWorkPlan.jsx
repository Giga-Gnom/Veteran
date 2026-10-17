import { useEffect, useState } from "react";
import styles from "./AdminMethodicalWorkPlan.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import AdminMethodicalWorkPlanEditor from "./AdminMethodicalWorkPlanEditor";
import methodicalService from "../../../services/methodicalService";

const AdminMethodicalWorkPlan = () => {
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedTable, setSelectedTable] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    useEffect(() => {
        loadPlans()
    }, [])

    const loadPlans = async () => {
        try {
            setLoading(true)
            const data = await methodicalService.getWorkPlans()
            const withRows = await Promise.all(data.map(async (plan) => {
                const rows = await methodicalService.getPlanRows(plan.id)
                return { ...plan, rows }
            }))
            setTables(withRows)
            return withRows
        } catch (e) {
            console.error("loadPlans error:", e)
            showError("Не удалось загрузить таблицы плана")
            return []
        } finally {
            setLoading(false)
        }
    }

    const handleOpenAdd = () => {
        setNewTitle("")
        setShowAddModal(true)
    }

    const handleCloseAdd = () => {
        setNewTitle("")
        setShowAddModal(false)
    }

    const handleAddTable = async () => {
        if (!newTitle.trim()) return showError("Введите название таблицы")
        try {
            await methodicalService.addWorkPlan({ title: newTitle.trim(), columns: [] })
            handleCloseAdd()
            await loadPlans()
            showAlert("Таблица создана")
        } catch (e) {
            console.error(e)
            showError("Ошибка при создании таблицы")
        }
    }

    const handleDeleteTable = async (table) => {
        const confirmed = await showConfirm(`Удалить таблицу "${table.title}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deleteWorkPlan(table.id)
            if (selectedTable?.id === table.id) {
                setSelectedTable(null)
            }
            await loadPlans()
            showAlert("Таблица удалена")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении таблицы")
        }
    }

    const handleOpenTable = (table) => {
        // защита от невалидных объектов
        if (!table || !table.id) return
        setSelectedTable(table)
    }

    const handleBackToList = async () => {
        setSelectedTable(null)
        await loadPlans()
    }

    const handleUpdateTable = async (updated) => {
        if (!updated || !updated.id) {
            showError("Некорректные данные таблицы")
            return
        }

        try {
            // 1. Сохраняем метаданные таблицы
            await methodicalService.updateWorkPlan(updated.id, {
                title: updated.title,
                columns: updated.columns
            })

            // 2. Синхронизируем строки
            const dbRows = await methodicalService.getPlanRows(updated.id)
            const dbIds = new Set(dbRows.map(r => r.id))
            const localIds = new Set(updated.rows.map(r => r.id))

            // удалить отсутствующие
            for (const dbRow of dbRows) {
                if (!localIds.has(dbRow.id)) {
                    await methodicalService.deletePlanRow(dbRow.id)
                }
            }
            // обновить существующие / добавить новые
            for (const row of updated.rows) {
                if (dbIds.has(row.id)) {
                    await methodicalService.updatePlanRow(row.id, row.data)
                } else {
                    await methodicalService.addPlanRow(updated.id, row.data)
                }
            }

            // 3. Перезагружаем всё и подтягиваем свежую версию
            const fresh = await loadPlans()
            const freshTable = fresh.find(p => p.id === updated.id)
            if (freshTable) {
                setSelectedTable(freshTable)
            } else {
                // таблица пропала (например, её удалили в параллельной вкладке)
                setSelectedTable(null)
                showError("Таблица больше не существует")
            }
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении таблицы")
        }
    }

    // ==== Редактор ====

    if (selectedTable && selectedTable.id) {
        return (
            <>
                {error && <ErrorMassage message={error} onClose={clearError}/>}
                <AdminMethodicalWorkPlanEditor
                    table={selectedTable}
                    onBack={handleBackToList}
                    onChange={handleUpdateTable}
                    showError={showError}
                />
            </>
        )
    }

    // ==== Список таблиц ====

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>План работы</h3>
                <button className={common.add_table_btn} onClick={handleOpenAdd}>
                    + Добавить таблицу
                </button>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : tables.length === 0 ? (
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
                            onClick={() => handleOpenTable(table)}
                        >
                            <div className={styles.table_header}>
                                <h4 className={styles.table_title}>{table.title}</h4>
                                <button
                                    className={common.delete_btn}
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTable(table) }}
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