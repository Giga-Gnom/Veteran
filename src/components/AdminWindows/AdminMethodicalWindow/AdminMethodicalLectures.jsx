import { useState } from "react";
import styles from "./AdminMethodicalLectures.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const STUB_LECTURES = [
    {
        id: 0,
        title: "Основы социальной защиты ветеранов",
        external_url: null,
        file: { original_name: "lecture-01.pdf", mime_type: "application/pdf", url: "#" }
    },
    {
        id: 1,
        title: "Патриотическое воспитание: современные подходы",
        external_url: null,
        file: { original_name: "lecture-02.pptx", mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", url: "#" }
    },
    {
        id: 2,
        title: "Организационно-плановая работа",
        external_url: "https://example.org/lecture/123",
        file: null
    }
]

const AdminMethodicalLectures = () => {
    const [lectures, setLectures] = useState(STUB_LECTURES)
    const [showModal, setShowModal] = useState(false)
    const [editingLecture, setEditingLecture] = useState(null)
    const [form, setForm] = useState({ title: "", external_url: "", file: null })
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

    const handleOpenAdd = () => {
        setEditingLecture(null)
        setForm({ title: "", external_url: "", file: null })
        setShowModal(true)
    }

    const handleOpenEdit = (lecture) => {
        setEditingLecture(lecture)
        setForm({
            title: lecture.title,
            external_url: lecture.external_url ?? "",
            file: lecture.file
        })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setEditingLecture(null)
        setForm({ title: "", external_url: "", file: null })
        setShowModal(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setForm(prev => ({
            ...prev,
            file: {
                original_name: file.name,
                mime_type: file.type || "application/octet-stream",
                url: "#"
            }
        }))
    }

    const handleSave = () => {
        if (!form.title.trim()) return showError("Введите название лекции")
        if (!form.file && !form.external_url.trim()) {
            return showError("Прикрепите файл или укажите ссылку")
        }
        if (editingLecture) {
            setLectures(prev => prev.map(l => l.id === editingLecture.id ? {
                ...l,
                title: form.title.trim(),
                external_url: form.external_url.trim() || null,
                file: form.file
            } : l))
            showAlert("Лекция обновлена")
        } else {
            setLectures(prev => [...prev, {
                id: Date.now(),
                title: form.title.trim(),
                external_url: form.external_url.trim() || null,
                file: form.file
            }])
            showAlert("Лекция добавлена")
        }
        handleCloseModal()
    }

    const handleDelete = async (lecture) => {
        const confirmed = await showConfirm(`Удалить лекцию "${lecture.title}"?`)
        if (!confirmed) return
        setLectures(prev => prev.filter(l => l.id !== lecture.id))
    }

    const formatFileType = (file) => {
        if (!file) return "Ссылка"
        return file.original_name.split(".").pop().toUpperCase()
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

            {lectures.length === 0 ? (
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
                                <span className={styles.lecture_type}>{formatFileType(lecture.file)}</span>
                                <h4 className={styles.lecture_title}>{lecture.title}</h4>
                            </div>
                            <div className={styles.lecture_body}>
                                {lecture.file ? (
                                    <div className={styles.lecture_file}>
                                        <span className={styles.file_icon}>📄</span>
                                        <span className={styles.file_name}>{lecture.file.original_name}</span>
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
                                <input
                                    type="file"
                                    id="lectureFile"
                                    onChange={handleFileChange}
                                    className={common.file_input}
                                />
                                <label htmlFor="lectureFile" className={common.file_upload_label}>
                                    {form.file ? form.file.original_name : "Выберите файл"}
                                </label>
                            </div>
                            {form.file && (
                                <button
                                    className={common.clear_file_btn}
                                    onClick={() => setForm(prev => ({ ...prev, file: null }))}
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