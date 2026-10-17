import { useState } from "react";
import styles from "./AdminSectionResults.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const AdminSectionResults = ({ section, onChange }) => {
    const [showModal, setShowModal] = useState(false)
    const [editingResult, setEditingResult] = useState(null)
    const [form, setForm] = useState({ title: "", external_url: "", file: null })
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    const handleOpenAdd = () => {
        setEditingResult(null)
        setForm({ title: "", external_url: "", file: null })
        setShowModal(true)
    }

    const handleOpenEdit = (result) => {
        setEditingResult(result)
        setForm({ title: result.title, external_url: result.external_url ?? "", file: result.file })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setEditingResult(null)
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
        if (editingResult) {
            onChange({
                ...section,
                results: section.results.map(r => r.id === editingResult.id ? {
                    ...r,
                    title: form.title.trim(),
                    external_url: form.external_url.trim() || null,
                    file: form.file
                } : r)
            })
            showAlert("Итог обновлён")
        } else {
            onChange({
                ...section,
                results: [...section.results, {
                    id: Date.now(),
                    title: form.title.trim(),
                    external_url: form.external_url.trim() || null,
                    file: form.file
                }]
            })
            showAlert("Итог добавлен")
        }
        handleCloseModal()
    }

    const handleDelete = async (result) => {
        const confirmed = await showConfirm(`Удалить итог "${result.title}"?`)
        if (!confirmed) return
        onChange({ ...section, results: section.results.filter(r => r.id !== result.id) })
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>Итоги работы, результаты</h3>
                <button className={common.add_btn} onClick={handleOpenAdd}>
                    + Добавить итог
                </button>
            </div>

            {section.results.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>📊</div>
                    <p>Итогов пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первый итог
                    </button>
                </div>
            ) : (
                <div className={styles.results_grid}>
                    {section.results.map(result => (
                        <div key={result.id} className={styles.result_card}>
                            <h4 className={styles.result_title}>{result.title}</h4>
                            <div className={styles.result_meta}>
                                {result.file ? (
                                    <span className={styles.result_file}>📄 {result.file.original_name}</span>
                                ) : (
                                    <a href={result.external_url} target="_blank" rel="noreferrer" className={styles.result_url}>
                                        🔗 внешняя ссылка
                                    </a>
                                )}
                            </div>
                            <div className={styles.result_actions}>
                                <button className={common.view_btn} onClick={() => handleOpenEdit(result)}>Изменить</button>
                                <button className={common.delete_btn} onClick={() => handleDelete(result)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={common.modal_overlay} onClick={handleCloseModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingResult ? "Редактировать итог" : "Новый итог"}</h3>

                        <div className={common.form_group}>
                            <label htmlFor="resultTitle">Название *</label>
                            <input
                                id="resultTitle"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Например: Отчёт за I квартал 2025"
                                autoFocus
                            />
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="resultUrl">Внешняя ссылка</label>
                            <input
                                id="resultUrl"
                                type="url"
                                value={form.external_url}
                                onChange={(e) => setForm(prev => ({ ...prev, external_url: e.target.value }))}
                                placeholder="https://..."
                            />
                            <small className={common.hint}>Можно указать ссылку вместо файла</small>
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="resultFile">Файл (PDF, Word, PNG, PPTX и др.)</label>
                            <div className={common.file_upload_container}>
                                <input type="file" id="resultFile" onChange={handleFileChange} className={common.file_input}/>
                                <label htmlFor="resultFile" className={common.file_upload_label}>
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

export default AdminSectionResults