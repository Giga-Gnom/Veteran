import { useState } from "react";
import styles from "./AdminSectionDocuments.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const DOC_TYPES = [
    { id: "normative",       title: "Нормативно-правовые документы" },
    { id: "recommendations", title: "Методические рекомендации" },
    { id: "manuals",         title: "Пособия, памятки" }
]

const AdminSectionDocuments = ({ section, onChange }) => {
    const [showModal, setShowModal] = useState(false)
    const [editingDoc, setEditingDoc] = useState(null)
    const [currentType, setCurrentType] = useState("normative")
    const [form, setForm] = useState({ title: "", external_url: "", file: null })
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    const handleOpenAdd = (type) => {
        setEditingDoc(null)
        setCurrentType(type)
        setForm({ title: "", external_url: "", file: null })
        setShowModal(true)
    }

    const handleOpenEdit = (doc) => {
        setEditingDoc(doc)
        setCurrentType(doc.doc_type)
        setForm({ title: doc.title, external_url: doc.external_url ?? "", file: doc.file })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setEditingDoc(null)
        setForm({ title: "", external_url: "", file: null })
        setShowModal(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setForm(prev => ({
            ...prev,
            file: { original_name: file.name, mime_type: file.type || "application/octet-stream", url: "#" }
        }))
    }

    const handleSave = () => {
        if (!form.title.trim()) return showError("Введите название")
        if (!form.file && !form.external_url.trim()) {
            return showError("Прикрепите файл или укажите ссылку")
        }
        if (editingDoc) {
            onChange({
                ...section,
                documents: section.documents.map(d => d.id === editingDoc.id ? {
                    ...d,
                    title: form.title.trim(),
                    doc_type: currentType,
                    external_url: form.external_url.trim() || null,
                    file: form.file
                } : d)
            })
            showAlert("Документ обновлён")
        } else {
            onChange({
                ...section,
                documents: [...section.documents, {
                    id: Date.now(),
                    doc_type: currentType,
                    title: form.title.trim(),
                    external_url: form.external_url.trim() || null,
                    file: form.file
                }]
            })
            showAlert("Документ добавлен")
        }
        handleCloseModal()
    }

    const handleDelete = async (doc) => {
        const confirmed = await showConfirm(`Удалить документ "${doc.title}"?`)
        if (!confirmed) return
        onChange({ ...section, documents: section.documents.filter(d => d.id !== doc.id) })
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={styles.columns}>
                {DOC_TYPES.map(type => {
                    const items = section.documents.filter(d => d.doc_type === type.id)
                    return (
                        <div key={type.id} className={styles.column}>
                            <div className={styles.column_header}>
                                <h4 className={styles.column_title}>{type.title}</h4>
                                <button className={common.add_btn} onClick={() => handleOpenAdd(type.id)}>
                                    + Добавить
                                </button>
                            </div>
                            <div className={styles.column_list}>
                                {items.length === 0 ? (
                                    <div className={styles.column_empty}>Документов нет</div>
                                ) : (
                                    items.map(doc => (
                                        <div key={doc.id} className={styles.doc_card}>
                                            <div className={styles.doc_name}>{doc.title}</div>
                                            <div className={styles.doc_meta}>
                                                {doc.file ? (
                                                    <span className={styles.doc_file}>📄 {doc.file.original_name}</span>
                                                ) : (
                                                    <a href={doc.external_url} target="_blank" rel="noreferrer" className={styles.doc_url}>
                                                        🔗 внешняя ссылка
                                                    </a>
                                                )}
                                            </div>
                                            <div className={styles.doc_actions}>
                                                <button className={common.view_btn} onClick={() => handleOpenEdit(doc)}>Изменить</button>
                                                <button className={common.delete_btn} onClick={() => handleDelete(doc)}>Удалить</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {showModal && (
                <div className={common.modal_overlay} onClick={handleCloseModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>
                            {editingDoc
                                ? "Редактировать документ"
                                : `Добавить в «${DOC_TYPES.find(t => t.id === currentType)?.title}»`}
                        </h3>

                        <div className={common.form_group}>
                            <label htmlFor="docTitle">Название *</label>
                            <input
                                id="docTitle"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Введите название документа"
                                autoFocus
                            />
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="docType">Тип документа</label>
                            <select
                                id="docType"
                                value={currentType}
                                onChange={(e) => setCurrentType(e.target.value)}
                            >
                                {DOC_TYPES.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="docUrl">Внешняя ссылка</label>
                            <input
                                id="docUrl"
                                type="url"
                                value={form.external_url}
                                onChange={(e) => setForm(prev => ({ ...prev, external_url: e.target.value }))}
                                placeholder="https://..."
                            />
                            <small className={common.hint}>Можно указать ссылку вместо файла</small>
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="docFile">Файл (PDF, Word, PNG, PPTX и др.)</label>
                            <div className={common.file_upload_container}>
                                <input type="file" id="docFile" onChange={handleFileChange} className={common.file_input}/>
                                <label htmlFor="docFile" className={common.file_upload_label}>
                                    {form.file ? form.file.original_name : "Выберите файл"}
                                </label>
                            </div>
                            {form.file && (
                                <button className={common.clear_file_btn} onClick={() => setForm(prev => ({ ...prev, file: null }))}>
                                    Убрать файл
                                </button>
                            )}
                        </div>

                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseModal}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleSave}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSectionDocuments