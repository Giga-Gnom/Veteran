import { useEffect, useState } from "react";
import styles from "./AdminMethodicalLectures.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import methodicalService from "../../../services/methodicalService";

const AdminMethodicalLectures = () => {
    const [lectures, setLectures] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingLecture, setEditingLecture] = useState(null)
    const [form, setForm] = useState({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    useEffect(() => { loadLectures() }, [])

    const loadLectures = async () => {
        try {
            setLoading(true)
            setLectures(await methodicalService.getLectures())
        } catch (e) {
            console.error(e)
            showError("Не удалось загрузить лекции")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setEditingLecture(null)
        setForm({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    }

    const handleOpenAdd = () => {
        resetForm()
        setShowModal(true)
    }

    const handleOpenEdit = (lecture) => {
        setEditingLecture(lecture)
        setForm({
            title: lecture.title,
            external_url: lecture.external_url ?? "",
            file_name: lecture.file_name,
            file_path: lecture.file_path,
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
        if (!form.title.trim()) return showError("Введите название лекции")
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
                title: form.title.trim(),
                external_url: form.external_url.trim() || null,
                file_path,
                file_name
            }

            if (editingLecture) {
                await methodicalService.updateLecture(editingLecture.id, payload)
                showAlert("Лекция обновлена")
            } else {
                await methodicalService.addLecture(payload)
                showAlert("Лекция добавлена")
            }

            handleCloseModal()
            await loadLectures()
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении")
        }
    }

    const handleDelete = async (lecture) => {
        const confirmed = await showConfirm(`Удалить лекцию "${lecture.title}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deleteLecture(lecture.id)
            await loadLectures()
            showAlert("Лекция удалена")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении")
        }
    }

    const formatFileType = (file_name) => {
        if (!file_name) return "Ссылка"
        return file_name.split(".").pop().toUpperCase()
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>Лекторская группа</h3>
                <button className={common.add_btn} onClick={handleOpenAdd}>
                    + Добавить лекцию
                </button>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : lectures.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>🎓</div>
                    <p>Лекций пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первую лекцию
                    </button>
                </div>
            ) : (
                <div className={styles.lectures_grid}>
                    {lectures.map(lecture => (
                        <div key={lecture.id} className={styles.lecture_card}>
                            <div className={styles.lecture_header}>
                                <span className={styles.lecture_type}>{formatFileType(lecture.file_name)}</span>
                                <h4 className={styles.lecture_title}>{lecture.title}</h4>
                            </div>
                            <div className={styles.lecture_body}>
                                {lecture.file_name ? (
                                    <div className={styles.lecture_file}>
                                        <span className={styles.file_icon}>📄</span>
                                        <span className={styles.file_name}>{lecture.file_name}</span>
                                    </div>
                                ) : (
                                    <div className={styles.lecture_url}>
                                        <span className={styles.url_icon}>🔗</span>
                                        <a href={lecture.external_url} target="_blank" rel="noreferrer">
                                            {lecture.external_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className={styles.lecture_actions}>
                                <button className={common.view_btn} onClick={() => handleOpenEdit(lecture)}>Изменить</button>
                                <button className={common.delete_btn} onClick={() => handleDelete(lecture)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={common.modal_overlay} onClick={handleCloseModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingLecture ? "Редактировать лекцию" : "Новая лекция"}</h3>

                        <div className={common.form_group}>
                            <label htmlFor="lectureTitle">Название *</label>
                            <input
                                id="lectureTitle"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Введите название лекции"
                                autoFocus
                            />
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="lectureUrl">Внешняя ссылка</label>
                            <input
                                id="lectureUrl"
                                type="url"
                                value={form.external_url}
                                onChange={(e) => setForm(prev => ({ ...prev, external_url: e.target.value }))}
                                placeholder="https://..."
                            />
                            <small className={common.hint}>Можно указать ссылку вместо файла</small>
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="lectureFile">Файл (PDF, Word, PPTX, PNG и др.)</label>
                            <div className={common.file_upload_container}>
                                <input type="file" id="lectureFile" onChange={handleFileChange} className={common.file_input}/>
                                <label htmlFor="lectureFile" className={common.file_upload_label}>
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

export default AdminMethodicalLectures