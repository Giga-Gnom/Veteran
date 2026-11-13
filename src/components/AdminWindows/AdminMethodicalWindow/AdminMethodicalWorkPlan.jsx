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
    
    // Состояния для добавления таблицы
    const [showAddModal, setShowAddModal] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    
    // Состояния для добавления файла
    const [showFileModal, setShowFileModal] = useState(false)
    const [fileTitle, setFileTitle] = useState("")
    const [fileObj, setFileObj] = useState(null)
    const [fileUploading, setFileUploading] = useState(false)

    const [error, setError] = useState(null)

    // ==== Импорт из Word ====
    const [showImportModal, setShowImportModal] = useState(false)
    const [importFile, setImportFile] = useState(null)
    const [importTitle, setImportTitle] = useState("")
    const [parsedTable, setParsedTable] = useState(null) 
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
                if (plan.plan_type === 'file') {
                    return { ...plan, rows: [] } // У файлов нет строк таблицы
                }
                const rows = await methodicalService.getPlanRows(plan.id)
                return { ...plan, rows }
            }))
            setTables(withRows)
            return withRows
        } catch (e) {
            console.error("loadPlans error:", e)
            showError("Не удалось загрузить планы")
            return []
        } finally {
            setLoading(false)
        }
    }

    // ========== ПЕРЕМЕЩЕНИЕ СТРЕЛОЧКАМИ ==========
    const handleMoveUp = async (index) => {
        if (index === 0) return;
        const newTables = [...tables];
        [newTables[index - 1], newTables[index]] = [newTables[index], newTables[index - 1]];
        setTables(newTables);
        try {
            const orderedIds = newTables.map(t => t.id);
            await methodicalService.updateWorkPlanOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }

    const handleMoveDown = async (index) => {
        if (index === tables.length - 1) return;
        const newTables = [...tables];
        [newTables[index + 1], newTables[index]] = [newTables[index], newTables[index + 1]];
        setTables(newTables);
        try {
            const orderedIds = newTables.map(t => t.id);
            await methodicalService.updateWorkPlanOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }
    // ===========================================

    // ==== Добавление таблицы ====
    const handleOpenAdd = () => {
        setNewTitle("")
        setShowAddModal(true)
    }

    const handleCloseAdd = () => {
        setNewTitle("")
        setShowAddModal(false)
    }

    const handleAddTable = async () => {
        if (!newTitle.trim()) return showError("Введите название")
        try {
            await methodicalService.addWorkPlan({ 
                title: newTitle.trim(), 
                plan_type: 'table',
                columns: [] 
            })
            handleCloseAdd()
            await loadPlans()
            showAlert("Таблица создана")
        } catch (e) {
            console.error(e)
            showError("Ошибка при создании таблицы")
        }
    }

    // ==== Добавление файла ====
    const handleOpenAddFile = () => {
        setFileTitle("")
        setFileObj(null)
        setShowFileModal(true)
    }

    const handleCloseFileModal = () => {
        setShowFileModal(false)
        setFileTitle("")
        setFileObj(null)
    }

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFileObj(file)
        if (!fileTitle) {
            setFileTitle(file.name.replace(/\.[^/.]+$/, "")) // Автоназвание без расширения
        }
    }

    const handleSaveFilePlan = async () => {
        if (!fileTitle.trim()) return showError("Введите название плана")
        if (!fileObj) return showError("Выберите файл")

        setFileUploading(true)
        try {
            const saved = await methodicalService.saveFileFromInput(fileObj)
            if (!saved) throw new Error("Ошибка при сохранении файла на диск")

            await methodicalService.addWorkPlan({
                title: fileTitle.trim(),
                plan_type: 'file',
                file_path: saved.file_path,
                file_name: saved.file_name,
                columns: []
            })

            handleCloseFileModal()
            await loadPlans()
            showAlert("Файл добавлен как план")
        } catch (e) {
            console.error(e)
            showError("Ошибка при добавлении файла")
        } finally {
            setFileUploading(false)
        }
    }

    const handleOpenFilePlan = async (plan) => {
        try {
            if (plan.file_path) {
                const res = await window.electronAPI.file.open(plan.file_path)
                if (!res.success) showError(`Не удалось открыть файл: ${res.error}`)
            }
        } catch (e) {
            console.error(e)
            showError("Ошибка при открытии файла")
        }
    }

    const handleDeleteTable = async (table) => {
        const confirmed = await showConfirm(`Удалить план "${table.title}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deleteWorkPlan(table.id)
            if (selectedTable?.id === table.id) setSelectedTable(null)
            await loadPlans()
            showAlert("План удалён")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении")
        }
    }

    const handleOpenTable = (table) => {
        if (!table || !table.id) return
        if (table.plan_type === 'file') {
            handleOpenFilePlan(table) // Если файл - открываем через ОС
        } else {
            setSelectedTable(table) // Если таблица - идем в редактор
        }
    }

    // ... (Импорт из Word и обработчики редактора остаются без изменений)
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
            const doc = new DOMParser().parseFromString(result.value, "text/html")
            const table = doc.querySelector("table")

            if (!table) { showError("В файле не найдена таблица"); return }

            const trs = Array.from(table.querySelectorAll("tr"))
            const grid = trs.map(tr => Array.from(tr.querySelectorAll("th, td")).map(td => td.textContent.trim()))

            if (grid.length === 0) { showError("Таблица пустая"); return }

            const headers = grid[0]
            const rows = grid.slice(1)

            if (headers.length === 0) { showError("Не удалось определить колонки"); return }

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
            const baseTime = Date.now()
            const columns = parsedTable.headers.map((label, i) => ({
                key: `col_${baseTime}_${i}`,
                label: label || `Колонка ${i + 1}`,
                type: "string"
            }))

            const planId = await methodicalService.addWorkPlan({
                title: importTitle.trim(),
                plan_type: 'table',
                columns
            })

            for (const row of parsedTable.rows) {
                const data = {}
                columns.forEach((col, i) => { data[col.key] = row[i] ?? "" })
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

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>План работы</h3>
                <div className={styles.header_actions}>
                    <button className={common.add_table_btn} onClick={handleOpenImport}>📥 Импорт из Word</button>
                    <button className={common.add_table_btn} onClick={handleOpenAddFile}>📄 Добавить файл</button>
                    <button className={common.add_table_btn} onClick={handleOpenAdd}>+ Таблица</button>
                </div>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : tables.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>📋</div>
                    <p>Планов пока нет</p>
                    <div className={styles.empty_actions}>
                        <button className={common.add_first_btn} onClick={handleOpenAdd}>+ Создать таблицу</button>
                        <button className={common.add_first_btn} onClick={handleOpenAddFile}>📄 Загрузить файл</button>
                    </div>
                </div>
            ) : (
                <div className={styles.tables_grid}>
                    {tables.map((table, index) => (
                        <div key={table.id} className={styles.table_card} onClick={() => handleOpenTable(table)}>
                            
                            <div className={styles.table_header}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5vw' }}>{table.plan_type === 'file' ? '📄' : '📊'}</span>
                                    <h4 className={styles.table_title}>{table.title}</h4>
                                </div>
                                
                                {/* --- ВОТ ОНИ, СТРЕЛОЧКИ И УДАЛЕНИЕ --- */}
                                <div className={styles.card_actions}>
                                    <div className={styles.sort_controls}>
                                        <button 
                                            className={styles.sort_btn} 
                                            onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }} 
                                            disabled={index === 0}
                                            title="Переместить вверх"
                                        >
                                            ⬆️
                                        </button>
                                        <button 
                                            className={styles.sort_btn} 
                                            onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }} 
                                            disabled={index === tables.length - 1}
                                            title="Переместить вниз"
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                    
                                    <button 
                                        className={common.delete_btn} 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteTable(table) }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                                {/* ------------------------------------- */}

                            </div>
                            <div className={styles.table_meta}>
                                {table.plan_type === 'file' ? (
                                    <span>Документ: {table.file_name}</span>
                                ) : (
                                    <><span>{table.columns.length} колонок</span><span>·</span><span>{table.rows?.length || 0} строк</span></>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалки (Новая таблица, Новый файл, Импорт) остаются без изменений */}
            {showAddModal && (
                <div className={common.modal_overlay} onClick={handleCloseAdd}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Новая таблица</h3>
                        <div className={common.form_group}>
                            <label>Название таблицы *</label>
                            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
                        </div>
                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseAdd}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleAddTable}>Создать</button>
                        </div>
                    </div>
                </div>
            )}

            {showFileModal && (
                <div className={common.modal_overlay} onClick={handleCloseFileModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Добавить файл как план</h3>
                        <div className={common.form_group}>
                            <label>Название плана *</label>
                            <input type="text" value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} placeholder="Например: План на 2025 год" autoFocus />
                        </div>
                        <div className={common.form_group}>
                            <label>Файл (PDF, Word, Excel и др.)</label>
                            <div className={common.file_upload_container}>
                                <input type="file" id="planFile" onChange={handleFileSelect} className={common.file_input}/>
                                <label htmlFor="planFile" className={common.file_upload_label}>
                                    {fileObj ? fileObj.name : "Выберите файл"}
                                </label>
                            </div>
                        </div>
                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseFileModal} disabled={fileUploading}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleSaveFilePlan} disabled={fileUploading}>
                                {fileUploading ? "Загрузка..." : "Сохранить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImportModal && (
                <div className={common.modal_overlay} onClick={handleCloseImport}>
                    <div className={`${common.modal} ${styles.import_modal}`} onClick={(e) => e.stopPropagation()}>
                        <h3>Импорт таблицы из Word</h3>
                        <div className={common.form_group}>
                            <label>Файл .docx *</label>
                            <div className={common.file_upload_container}>
                                <input type="file" id="importFile" accept=".docx" onChange={handleImportFileChange} className={common.file_input}/>
                                <label htmlFor="importFile" className={common.file_upload_label}>
                                    {importFile ? importFile.name : "Выберите .docx файл"}
                                </label>
                            </div>
                        </div>
                        <div className={common.form_group}>
                            <label>Название новой таблицы *</label>
                            <input type="text" value={importTitle} onChange={(e) => setImportTitle(e.target.value)} placeholder="Название таблицы" />
                        </div>
                        {parsing && <div className={styles.import_status}>Разбор файла...</div>}
                        {parsedTable && (
                            <div className={styles.import_preview}>
                                <div className={styles.import_preview_header}>
                                    Найдено: <strong>{parsedTable.headers.length}</strong> колонок, <strong>{parsedTable.rows.length}</strong> строк
                                </div>
                                <div className={styles.import_preview_scroll}>
                                    <table className={styles.import_preview_table}>
                                        <thead>
                                            <tr>{parsedTable.headers.map((h, i) => <th key={i}>{h || `Колонка ${i + 1}`}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {parsedTable.rows.slice(0, 5).map((row, ri) => (
                                                <tr key={ri}>{parsedTable.headers.map((_, ci) => <td key={ci}>{row[ci] ?? ""}</td>)}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseImport} disabled={importing}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleDoImport} disabled={!parsedTable || importing || parsing}>
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