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

const AdminMethodicalWorkPlanEditor = ({ table, onBack, onChange, showError }) => {
    const [showColumnModal, setShowColumnModal] = useState(false)
    const [showRowModal, setShowRowModal] = useState(false)
    const [editingColumn, setEditingColumn] = useState(null)
    const [editingRow, setEditingRow] = useState(null)
    const [newColumn, setNewColumn] = useState({ key: "", label: "", type: "string" })
    const [rowData, setRowData] = useState({})

    const handleOpenAddColumn = () => {
        setEditingColumn(null)
        setNewColumn({ key: "", label: "", type: "string" })
        setShowColumnModal(true)
    }

    const handleOpenEditColumn = (col) => {
        setEditingColumn(col)
        setNewColumn({ ...col })
        setShowColumnModal(true)
    }

    const handleCloseColumnModal = () => {
        setEditingColumn(null)
        setNewColumn({ key: "", label: "", type: "string" })
        setShowColumnModal(false)
    }

    const handleSaveColumn = () => {
        if (!newColumn.key.trim()) return showError("Введите ключ колонки")
        if (!newColumn.label.trim()) return showError("Введите заголовок")
        const key = newColumn.key.trim().replace(/\s+/g, "_").toLowerCase()

        if (editingColumn) {
            onChange({
                ...table,
                columns: table.columns.map(c => c.key === editingColumn.key ? { ...newColumn, key } : c)
            })
            showAlert("Колонка обновлена")
        } else {
            if (table.columns.some(c => c.key === key)) {
                return showError("Колонка с таким ключом уже существует")
            }
            onChange({ ...table, columns: [...table.columns, { ...newColumn, key }] })
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

    const handleOpenAddRow = () => {
        setEditingRow(null)
        setRowData({})
        setShowRowModal(true)
    }

    const handleOpenEditRow = (row) => {
        setEditingRow(row)
        setRowData({ ...row.data })
        setShowRowModal(true)
    }

    const handleCloseRowModal = () => {
        setEditingRow(null)
        setRowData({})
        setShowRowModal(false)
    }

    const handleSaveRow = () => {
        if (editingRow) {
            onChange({
                ...table,
                rows: table.rows.map(r => r.id === editingRow.id ? { ...r, data: rowData } : r)
            })
            showAlert("Строка обновлена")
        } else {
            onChange({ ...table, rows: [...table.rows, { id: Date.now(), data: rowData }] })
            showAlert("Строка добавлена")
        }
        handleCloseRowModal()
    }

    const handleDeleteRow = async (row) => {
        const confirmed = await showConfirm("Удалить строку?")
        if (!confirmed) return
        onChange({ ...table, rows: table.rows.filter(r => r.id !== row.id) })
    }

    const handleRowFieldChange = (key, value) => {
        setRowData(prev => ({ ...prev, [key]: value }))
    }

    const renderCell = (value, col) => {
        if (value === null || value === undefined || value === "") {
            return <span className={styles.empty_cell}>—</span>
        }
        if (col.type === "url") return <a href={value} target="_blank" rel="noreferrer">{value}</a>
        if (col.type === "boolean") return value ? "Да" : "Нет"
        if (col.type === "file") return <span className={styles.file_cell}>📄 файл</span>
        return String(value)
    }

    return (
        <div>
            <div className={common.section_header}>
                <div className={common.header_left}>
                    <button className={common.back_btn} onClick={onBack}>← Назад к таблицам</button>
                    <h3 className={common.section_title}>{table.title}</h3>
                </div>
            </div>

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
                                    <th>Ключ</th>
                                    <th>Заголовок</th>
                                    <th>Тип</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.columns.map(col => (
                                    <tr key={col.key}>
                                        <td><code>{col.key}</code></td>
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

            <div className={styles.block}>
                <div className={styles.block_header}>
                    <h4 className={styles.block_title}>Строки</h4>
                    <button className={common.add_btn} onClick={handleOpenAddRow}>
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
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map(row => (
                                    <tr key={row.id}>
                                        {table.columns.map(col => (
                                            <td key={col.key}>{renderCell(row.data[col.key], col)}</td>
                                        ))}
                                        <td>
                                            <div className={styles.row_actions}>
                                                <button className={common.view_btn} onClick={() => handleOpenEditRow(row)}>Изменить</button>
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

            {showColumnModal && (
                <div className={common.modal_overlay} onClick={handleCloseColumnModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingColumn ? "Редактировать колонку" : "Новая колонка"}</h3>
                        <div className={common.form_group}>
                            <label htmlFor="colKey">Ключ *</label>
                            <input
                                id="colKey"
                                type="text"
                                value={newColumn.key}
                                onChange={(e) => setNewColumn(prev => ({ ...prev, key: e.target.value }))}
                                placeholder="event_name"
                                disabled={!!editingColumn}
                            />
                        </div>
                        <div className={common.form_group}>
                            <label htmlFor="colLabel">Заголовок *</label>
                            <input
                                id="colLabel"
                                type="text"
                                value={newColumn.label}
                                onChange={(e) => setNewColumn(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="Название мероприятия"
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

            {showRowModal && (
                <div className={common.modal_overlay} onClick={handleCloseRowModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingRow ? "Редактировать строку" : "Новая строка"}</h3>
                        {table.columns.map(col => (
                            <div className={common.form_group} key={col.key}>
                                <label htmlFor={`row_${col.key}`}>{col.label}</label>
                                {col.type === "text" ? (
                                    <textarea
                                        id={`row_${col.key}`}
                                        value={rowData[col.key] ?? ""}
                                        onChange={(e) => handleRowFieldChange(col.key, e.target.value)}
                                        rows={4}
                                    />
                                ) : col.type === "boolean" ? (
                                    <input
                                        id={`row_${col.key}`}
                                        type="checkbox"
                                        checked={!!rowData[col.key]}
                                        onChange={(e) => handleRowFieldChange(col.key, e.target.checked)}
                                    />
                                ) : (
                                    <input
                                        id={`row_${col.key}`}
                                        type={col.type === "number" ? "number" : col.type === "date" ? "date" : col.type === "url" ? "url" : "text"}
                                        value={rowData[col.key] ?? ""}
                                        onChange={(e) => handleRowFieldChange(col.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseRowModal}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleSaveRow}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMethodicalWorkPlanEditor