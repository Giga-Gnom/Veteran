import { useEffect, useState } from "react";
import mammoth from "mammoth";
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

    // ==== Импорт из Word ====
    const [showImportModal, setShowImportModal] = useState(false)
    const [importFile, setImportFile] = useState(null)
    const [importTitle, setImportTitle] = useState("")
    const [parsedTable, setParsedTable] = useState(null) // { headers: [], rows: [[], ...] }
    const [parsing, setParsing] = useState(false)
    const [importing, setImporting] = useState(false)

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
            if (selectedTable?.id === table.id) setSelectedTable(null)
            await loadPlans()
            showAlert("Таблица удалена")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении таблицы")
        }
    }

    const handleOpenTable = (table) => {
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
            await methodicalService.updateWorkPlan(updated.id, {
                title: updated.title,
                columns: updated.columns
            })

            const dbRows = await methodicalService.getPlanRows(updated.id)
            const dbIds = new Set(dbRows.map(r => r.id))
            const localIds = new Set(updated.rows.map(r => r.id))

            for (const dbRow of dbRows) {
                if (!localIds.has(dbRow.id)) {
                    await methodicalService.deletePlanRow(dbRow.id)
                }
            }
            for (const row of updated.rows) {
                if (dbIds.has(row.id)) {
                    await methodicalService.updatePlanRow(row.id, row.data)
                } else {
                    await methodicalService.addPlanRow(updated.id, row.data)
                }
            }

            const fresh = await loadPlans()
            const freshTable = fresh.find(p => p.id === updated.id)
            if (freshTable) {
                setSelectedTable(freshTable)
            } else {
                setSelectedTable(null)
                showError("Таблица больше не существует")
            }
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении таблицы")
        }
    }

    // ========== Импорт из Word ==========

    const handleOpenImport = () => {
        setImportFile(null)
        setParsedTable(null)
        setImportTitle("")
        setShowImportModal(true)
    }

    const handleCloseImport = () => {
        setShowImportModal(false)
        setImportFile(null)
        setParsedTable(null)
        setImportTitle("")
    }

    const handleImportFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImportFile(file)
        setImportTitle(file.name.replace(/\.docx$/i, ""))
        setParsedTable(null)
        setParsing(true)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.convertToHtml({ arrayBuffer })
            const html = result.value

            const doc = new DOMParser().parseFromString(html, "text/html")
            const table = doc.querySelector("table")

            if (!table) {
                showError("В файле не найдена таблица")
                return
            }

            const trs = Array.from(table.querySelectorAll("tr"))
            const grid = trs.map(tr =>
                Array.from(tr.querySelectorAll("th, td")).map(td => td.textContent.trim())
            )

            if (grid.length === 0) {
                showError("Таблица пустая")
                return
            }

            const headers = grid[0]
            const rows = grid.slice(1)

            if (headers.length === 0) {
                showError("Не удалось определить колонки")
                return
            }

            setParsedTable({ headers, rows })
        } catch (err) {
            console.error("Import parse error:", err)
            showError("Не удалось разобрать файл: " + err.message)
        } finally {
            setParsing(false)
        }
    }

    const handleDoImport = async () => {
        if (!parsedTable) return
        if (!importTitle.trim()) return showError("Введите название таблицы")

        setImporting(true)
        try {
            // 1. Колонки — из первой строки. Всё делаем type: "string",
            //    потом в редакторе можно поменять тип.
            const baseTime = Date.now()
            const columns = parsedTable.headers.map((label, i) => ({
                key: `col_${baseTime}_${i}`,
                label: label || `Колонка ${i + 1}`,
                type: "string"
            }))

            // 2. Создаём план
            const planId = await methodicalService.addWorkPlan({
                title: importTitle.trim(),
                columns
            })

            // 3. Строки
            for (const row of parsedTable.rows) {
                const data = {}
                columns.forEach((col, i) => {
                    data[col.key] = row[i] ?? ""
                })
                await methodicalService.addPlanRow(planId, data)
            }

            handleCloseImport()
            await loadPlans()
            showAlert(`Импортировано: ${columns.length} колонок, ${parsedTable.rows.length} строк`)
        } catch (err) {
            console.error("Import save error:", err)
            showError("Ошибка при импорте таблицы")
        } finally {
            setImporting(false)
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
                <div className={styles.header_actions}>
                    <button className={common.add_table_btn} onClick={handleOpenImport}>
                        📥 Импорт из Word
                    </button>
                    <button className={common.add_table_btn} onClick={handleOpenAdd}>
                        + Добавить таблицу
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : tables.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>📋</div>
                    <p>Таблиц пока нет</p>
                    <div className={styles.empty_actions}>
                        <button className={common.add_first_btn} onClick={handleOpenAdd}>
                            + Добавить первую таблицу
                        </button>
                        <button className={common.add_first_btn} onClick={handleOpenImport}>
                            📥 Импортировать из Word
                        </button>
                    </div>
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

            {/* ===== Модалка импорта ===== */}
            {showImportModal && (
                <div className={common.modal_overlay} onClick={handleCloseImport}>
                    <div className={`${common.modal} ${styles.import_modal}`} onClick={(e) => e.stopPropagation()}>
                        <h3>Импорт таблицы из Word</h3>

                        <div className={common.form_group}>
                            <label htmlFor="importFile">Файл .docx *</label>
                            <div className={common.file_upload_container}>
                                <input
                                    type="file"
                                    id="importFile"
                                    accept=".docx"
                                    onChange={handleImportFileChange}
                                    className={common.file_input}
                                />
                                <label htmlFor="importFile" className={common.file_upload_label}>
                                    {importFile ? importFile.name : "Выберите .docx файл"}
                                </label>
                            </div>
                            <small className={common.hint}>
                                В файле должна быть таблица. Первая строка станет заголовками колонок.
                            </small>
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="importTitle">Название новой таблицы *</label>
                            <input
                                id="importTitle"
                                type="text"
                                value={importTitle}
                                onChange={(e) => setImportTitle(e.target.value)}
                                placeholder="Название таблицы в приложении"
                            />
                        </div>

                        {parsing && <div className={styles.import_status}>Разбор файла...</div>}

                        {parsedTable && (
                            <div className={styles.import_preview}>
                                <div className={styles.import_preview_header}>
                                    Найдено: <strong>{parsedTable.headers.length}</strong> колонок,{" "}
                                    <strong>{parsedTable.rows.length}</strong> строк
                                </div>
                                <div className={styles.import_preview_scroll}>
                                    <table className={styles.import_preview_table}>
                                        <thead>
                                            <tr>
                                                {parsedTable.headers.map((h, i) => (
                                                    <th key={i}>{h || `Колонка ${i + 1}`}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedTable.rows.slice(0, 5).map((row, ri) => (
                                                <tr key={ri}>
                                                    {parsedTable.headers.map((_, ci) => (
                                                        <td key={ci}>{row[ci] ?? ""}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {parsedTable.rows.length > 5 && (
                                    <div className={styles.import_more}>
                                        ... и ещё {parsedTable.rows.length - 5} строк
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseImport} disabled={importing}>
                                Отмена
                            </button>
                            <button
                                className={common.submit_btn}
                                onClick={handleDoImport}
                                disabled={!parsedTable || importing || parsing}
                            >
                                {importing ? "Импорт..." : "Импортировать"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMethodicalWorkPlan