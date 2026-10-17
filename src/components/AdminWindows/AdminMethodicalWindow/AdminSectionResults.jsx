import { useEffect, useState } from "react";
import styles from "./AdminSectionResults.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import methodicalService from "../../../services/methodicalService";

const AdminSectionResults = ({ sectionId, onChanged }) => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingResult, setEditingResult] = useState(null)
    const [form, setForm] = useState({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    const [error, setError] = useState(null)

    const showError = (m) => setError(m)
    const clearError = () => setError(null)

    useEffect(() => { loadResults() }, [sectionId])

    const loadResults = async () => {
        try {
            setLoading(true)
            setResults(await methodicalService.getResultsBySection(sectionId))
        } catch (e) {
            console.error(e)
            showError("Не удалось загрузить итоги")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setEditingResult(null)
        setForm({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    }

    const handleOpenAdd = () => {
        resetForm()
        setShowModal(true)
    }

    const handleOpenEdit = (result) => {
        setEditingResult(result)
        setForm({
            title: result.title,
            external_url: result.external_url ?? "",
            file_name: result.file_name,
            file_path: result.file_path,
            new_file: null
        })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        resetForm()
        setShowModal(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setForm(prev => ({ ...prev, new_file: file, file_name: file.name }))
    }

    const handleSave = async () => {
        if (!form.title.trim()) return showError("Введите название")
        if (!form.new_file && !form.file_name && !form.external_url.trim()) {
            return showError("Прикрепите файл или укажите ссылку")
        }

        try {
            let file_path = form.file_path
            let file_name = form.file_name

            if (form.new_file) {
                const saved = await methodicalService.saveFileFromInput(form.new_file)
                if (saved) {
                    file_path = saved.file_path
                    file_name = saved.file_name
                }
            }

            const payload = {
                section_id: sectionId,
                title: form.title.trim(),
                external_url: form.external_url.trim() || null,
                file_path,
                file_name
            }

            if (editingResult) {
                await methodicalService.updateResult(editingResult.id, payload)
                showAlert("Итог обновлён")
            } else {
                await methodicalService.addResult(payload)
                showAlert("Итог добавлен")
            }
            handleCloseModal()
            await loadResults()
            onChanged?.()
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении")
        }
    }

    const handleDelete = async (result) => {
        const confirmed = await showConfirm(`Удалить итог "${result.title}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deleteResult(result.id)
            await loadResults()
            onChanged?.()
            showAlert("Итог удалён")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении")
        }
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

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : results.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>📊</div>
                    <p>Итогов пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первый итог
                    </button>
                </div>
            ) : (
                <div className={styles.results_grid}>
                    {results.map(result => (
                        <div key={result.id} className={styles.result_card}>
                            <h4 className={styles.result_title}>{result.title}</h4>
                            <div className={styles.result_meta}>
                                {result.file_name ? (
                                    <span className={styles.result_file}>📄 {result.file_name}</span>
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
                                    {form.file_name ?? "Выберите файл"}
                                </label>
                            </div>
                            {form.file_name && (
                                <button
                                    className={common.clear_file_btn}
                                    onClick={() => setForm(prev => ({ ...prev, file_name: null, file_path: null, new_file: null }))}
                                >
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