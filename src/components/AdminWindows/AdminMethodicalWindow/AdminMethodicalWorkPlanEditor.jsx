import { useState } from "react";
import styles from "./AdminMethodicalWorkPlanEditor.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const COLUMN_TYPES = [
    { value: "string",  label: "Строка" },
    { value: "text",    label: "Текст" },
    { value: "number",  label: "Число" },
    { value: "date",    label: "Дата" },
    { value: "boolean", label: "Да / Нет" },
    { value: "url",     label: "Ссылка" },
    { value: "file",    label: "Файл" }
]

const generateColumnKey = () => `col_${Date.now()}_${Math.floor(Math.random() * 1000)}`

const AdminMethodicalWorkPlanEditor = ({ table, onBack, onChange, showError }) => {
    const [showColumnModal, setShowColumnModal] = useState(false)
    const [editingColumn, setEditingColumn] = useState(null)
    const [newColumn, setNewColumn] = useState({ label: "", type: "string" })

    if (!table) {
        return (
            <div>
                <div className={common.section_header}>
                    <button className={common.back_btn} onClick={onBack}>← Назад к таблицам</button>
                </div>
                <div className={common.empty_state}><p>Таблица не найдена</p></div>
            </div>
        )
    }

    // ========== Колонки ==========
    const handleOpenAddColumn = () => {
        setEditingColumn(null)
        setNewColumn({ label: "", type: "string" })
        setShowColumnModal(true)
    }

    const handleOpenEditColumn = (col) => {
        setEditingColumn(col)
        setNewColumn({ label: col.label, type: col.type })
        setShowColumnModal(true)
    }

    const handleCloseColumnModal = () => {
        setEditingColumn(null)
        setNewColumn({ label: "", type: "string" })
        setShowColumnModal(false)
    }

    const handleSaveColumn = () => {
        if (!newColumn.label.trim()) return showError("Введите заголовок колонки")

        if (editingColumn) {
            onChange({
                ...table,
                columns: table.columns.map(c =>
                    c.key === editingColumn.key
                        ? { ...c, label: newColumn.label.trim(), type: newColumn.type }
                        : c
                )
            })
            showAlert("Колонка обновлена")
        } else {
            onChange({
                ...table,
                columns: [
                    ...table.columns,
                    { key: generateColumnKey(), label: newColumn.label.trim(), type: newColumn.type }
                ]
            })
            showAlert("Колонка добавлена")
        }
        handleCloseColumnModal()
    }

    const handleDeleteColumn = async (col) => {
        const confirmed = await showConfirm(`Удалить колонку "${col.label}"?`)
        if (!confirmed) return
        onChange({
            ...table,
            columns: table.columns.filter(c => c.key !== col.key),
            rows: table.rows.map(r => {
                const { [col.key]: _removed, ...rest } = r.data
                return { ...r, data: rest }
            })
        })
    }

    // ========== Строки и ячейки ==========
    const handleAddEmptyRow = () => {
        onChange({
            ...table,
            rows: [...table.rows, { id: `new_${Date.now()}`, data: {} }]
        })
    }

    const handleUpdateCell = (rowId, colKey, value) => {
        onChange({
            ...table,
            rows: table.rows.map(r =>
                r.id === rowId ? { ...r, data: { ...r.data, [colKey]: value } } : r
            )
        })
    }

    const handleDeleteRow = async (row) => {
        const confirmed = await showConfirm("Удалить строку?")
        if (!confirmed) return
        onChange({ ...table, rows: table.rows.filter(r => r.id !== row.id) })
    }

    // Загрузка файла
    const handleFileUpload = async (rowId, colKey, file) => {
        if (!file) return
        try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)
            
            // Сохраняем файл через Electron API
            const result = await window.electronAPI.file.save(file.name, buffer)
            
            // Сохраняем в ячейку JSON с именем и путем к файлу
            const fileObj = { name: result.file_name, path: result.file_path }
            handleUpdateCell(rowId, colKey, JSON.stringify(fileObj))
            showAlert("Файл прикреплён")
        } catch (error) {
            console.error("File upload error:", error)
            showError("Ошибка при загрузке файла")
        }
    }

    // Парсинг данных файла для отображения
    const getFileData = (value) => {
        if (!value) return null
        try {
            return JSON.parse(value)
        } catch {
            return { name: value, path: value } // fallback для старых данных
        }
    }

    return (
        <div>
            <div className={common.section_header}>
                <div className={common.header_left}>
                    <button className={common.back_btn} onClick={onBack}>← Назад к таблицам</button>
                    <h3 className={common.section_title}>{table.title}</h3>
                </div>
            </div>

            {/* ===== Колонки ===== */}
            <div className={styles.block}>
                <div className={styles.block_header}>
                    <h4 className={styles.block_title}>Колонки</h4>
                    <button className={common.add_btn} onClick={handleOpenAddColumn}>
                        + Добавить колонку
                    </button>
                </div>

                {table.columns.length === 0 ? (
                    <div className={common.empty_state}><p>Колонок пока нет</p></div>
                ) : (
                    <div className={styles.table_container}>
                        <table className={styles.data_table}>
                            <thead>
                                <tr>
                                    <th>Заголовок</th>
                                    <th>Тип</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.columns.map(col => (
                                    <tr key={col.key}>
                                        <td>{col.label}</td>
                                        <td>{COLUMN_TYPES.find(t => t.value === col.type)?.label ?? col.type}</td>
                                        <td>
                                            <div className={styles.row_actions}>
                                                <button className={common.view_btn} onClick={() => handleOpenEditColumn(col)}>Изменить</button>
                                                <button className={common.delete_btn} onClick={() => handleDeleteColumn(col)}>Удалить</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ===== Данные (Строки) ===== */}
            <div className={styles.block}>
                <div className={styles.block_header}>
                    <h4 className={styles.block_title}>Данные таблицы</h4>
                    <button className={common.add_btn} onClick={handleAddEmptyRow}>
                        + Добавить строку
                    </button>
                </div>

                {table.columns.length === 0 ? (
                    <div className={common.empty_state}><p>Сначала добавьте хотя бы одну колонку</p></div>
                ) : table.rows.length === 0 ? (
                    <div className={common.empty_state}><p>Строк пока нет</p></div>
                ) : (
                    <div className={styles.table_container}>
                        <table className={styles.data_table}>
                            <thead>
                                <tr>
                                    {table.columns.map(col => <th key={col.key}>{col.label}</th>)}
                                    <th style={{ width: '100px' }}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map(row => (
                                    <tr key={row.id}>
                                        {table.columns.map(col => (
                                            <td key={col.key} style={{ padding: '4px', verticalAlign: 'top' }}>
                                                
                                                {/* --- ЧЕКБОКС --- */}
                                                {col.type === "boolean" ? (
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={!!row.data[col.key]}
                                                        onChange={(e) => handleUpdateCell(row.id, col.key, e.target.checked)}
                                                    />
                                                
                                                /* --- МНОГОСТРОЧНЫЙ ТЕКСТ --- */
                                                ) : col.type === "text" ? (
                                                    <textarea
                                                        className={styles.inline_input}
                                                        defaultValue={row.data[col.key] ?? ""}
                                                        onBlur={(e) => handleUpdateCell(row.id, col.key, e.target.value)}
                                                        rows={2}
                                                    />
                                                
                                                /* --- ЧИСЛО (с поддержкой запятой) --- */
                                                ) : col.type === "number" ? (
                                                    <input
                                                        className={styles.inline_input}
                                                        type="text"
                                                        inputMode="decimal"
                                                        defaultValue={row.data[col.key] ?? ""}
                                                        onBlur={(e) => {
                                                            // Меняем запятую на точку для БД
                                                            const val = e.target.value.replace(',', '.')
                                                            if (val && isNaN(Number(val))) {
                                                                showError("Введите корректное число")
                                                                e.target.value = row.data[col.key] ?? ""
                                                                return
                                                            }
                                                            handleUpdateCell(row.id, col.key, val)
                                                        }}
                                                    />
                                                
                                                /* --- ФАЙЛ --- */
                                                ) : col.type === "file" ? (
                                                    <div className={styles.file_cell_wrapper}>
                                                        {row.data[col.key] ? (
                                                            <div className={styles.file_value}>
                                                                <span 
                                                                    className={styles.file_link} 
                                                                    onClick={() => {
                                                                        const fileData = getFileData(row.data[col.key])
                                                                        if (fileData?.path) window.open(fileData.path, '_blank')
                                                                    }}
                                                                    title="Открыть файл"
                                                                >
                                                                    📄 {getFileData(row.data[col.key])?.name || "Файл"}
                                                                </span>
                                                                <button 
                                                                    className={styles.file_remove_btn} 
                                                                    onClick={() => handleUpdateCell(row.id, col.key, "")}
                                                                    title="Удалить файл"
                                                                >
                                                                    ✖
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className={styles.file_upload_label_inline}>
                                                                📎 Выбрать файл
                                                                <input
                                                                    type="file"
                                                                    style={{ display: 'none' }}
                                                                    onChange={(e) => handleFileUpload(row.id, col.key, e.target.files?.[0])}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>

                                                /* --- ОСТАЛЬНЫЕ (строка, дата, ссылка) --- */
                                                ) : (
                                                    <input
                                                        className={styles.inline_input}
                                                        type={
                                                            col.type === "date" ? "date" :
                                                            col.type === "url" ? "url" :
                                                            "text"
                                                        }
                                                        defaultValue={row.data[col.key] ?? ""}
                                                        onBlur={(e) => handleUpdateCell(row.id, col.key, e.target.value)}
                                                    />
                                                )}
                                            </td>
                                        ))}
                                        <td>
                                            <div className={styles.row_actions}>
                                                <button className={common.delete_btn} onClick={() => handleDeleteRow(row)}>Удалить</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ===== Модалка колонки ===== */}
            {showColumnModal && (
                <div className={common.modal_overlay} onClick={handleCloseColumnModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingColumn ? "Редактировать колонку" : "Новая колонка"}</h3>
                        
                        <div className={common.form_group}>
                            <label htmlFor="colLabel">Заголовок колонки *</label>
                            <input
                                id="colLabel"
                                type="text"
                                value={newColumn.label}
                                onChange={(e) => setNewColumn(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="Например: Название мероприятия"
                                autoFocus
                            />
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="colType">Тип данных *</label>
                            <select
                                id="colType"
                                value={newColumn.type}
                                onChange={(e) => setNewColumn(prev => ({ ...prev, type: e.target.value }))}
                            >
                                {COLUMN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>

                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseColumnModal}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleSaveColumn}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMethodicalWorkPlanEditor