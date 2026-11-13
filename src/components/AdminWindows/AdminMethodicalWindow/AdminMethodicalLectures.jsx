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
    
    // Состояние для массовой загрузки
    const [bulkLoading, setBulkLoading] = useState(false)

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

    // ========== ПЕРЕМЕЩЕНИЕ СТРЕЛОЧКАМИ ==========
    const handleMoveUp = async (index) => {
        if (index === 0) return; // Уже наверху
        
        const newLectures = [...lectures];
        // Меняем местами текущий и предыдущий элементы
        [newLectures[index - 1], newLectures[index]] = [newLectures[index], newLectures[index - 1]];
        
        setLectures(newLectures);
        
        try {
            const orderedIds = newLectures.map(l => l.id);
            await methodicalService.updateLectureOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }

    const handleMoveDown = async (index) => {
        if (index === lectures.length - 1) return; // Уже внизу
        
        const newLectures = [...lectures];
        // Меняем местами текущий и следующий элементы
        [newLectures[index + 1], newLectures[index]] = [newLectures[index], newLectures[index + 1]];
        
        setLectures(newLectures);
        
        try {
            const orderedIds = newLectures.map(l => l.id);
            await methodicalService.updateLectureOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }

    // ========== ОСТАЛЬНЫЕ ФУНКЦИИ ==========
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

    const handleOpen = async (lecture) => {
        try {
            if (lecture.file_path) {
                if (!window.electronAPI?.file?.open) {
                    showError("IPC-метод file.open не найден. Перезапустите приложение.")
                    return
                }
                const result = await window.electronAPI.file.open(lecture.file_path)
                if (!result.success) {
                    showError(`Не удалось открыть файл: ${result.error}`)
                }
            } else if (lecture.external_url) {
                window.open(lecture.external_url, "_blank", "noopener,noreferrer")
            } else {
                showError("У лекции нет ни файла, ни ссылки")
            }
        } catch (e) {
            console.error(e)
            showError("Ошибка при открытии документа")
        }
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

    const handleBulkUpload = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setBulkLoading(true)
        let successCount = 0

        try {
            for (const file of files) {
                const saved = await methodicalService.saveFileFromInput(file)
                if (!saved) continue

                const title = file.name.replace(/\.[^/.]+$/, "")

                const payload = {
                    title: title,
                    external_url: null,
                    file_name: saved.file_name,
                    file_path: saved.file_path
                }

                await methodicalService.addLecture(payload)
                successCount++
            }

            if (successCount > 0) {
                showAlert(`Успешно загружено лекций: ${successCount}`)
                await loadLectures()
            }
        } catch (err) {
            console.error("Bulk upload error:", err)
            showError("Произошла ошибка при массовой загрузке файлов")
        } finally {
            setBulkLoading(false)
            e.target.value = ""
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
                
                <div className={styles.header_actions}>
                    <button className={common.add_btn} onClick={handleOpenAdd}>
                        + Добавить лекцию
                    </button>
                    
                    <label 
                        className={`${common.add_btn} ${styles.bulk_btn}`} 
                        title="Выберите сразу несколько файлов (Ctrl/Shift)"
                    >
                        {bulkLoading ? "Загрузка..." : "📁 Массово"}
                        <input
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleBulkUpload}
                            disabled={bulkLoading}
                        />
                    </label>
                </div>
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
                    {lectures.map((lecture, index) => (
                        <div key={lecture.id} className={styles.lecture_card}>
                            <div className={styles.lecture_header}>
                                
                                {/* Верхняя строка с типом и стрелочками */}
                                <div className={styles.card_top_row}>
                                    <span className={styles.lecture_type}>{formatFileType(lecture.file_name)}</span>
                                    
                                    <div className={styles.sort_controls}>
                                        <button 
                                            className={styles.sort_btn} 
                                            onClick={() => handleMoveUp(index)} 
                                            disabled={index === 0}
                                            title="Переместить вверх"
                                        >
                                            ⬆️
                                        </button>
                                        <button 
                                            className={styles.sort_btn} 
                                            onClick={() => handleMoveDown(index)} 
                                            disabled={index === lectures.length - 1}
                                            title="Переместить вниз"
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                </div>

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
                                <button className={common.open_btn} onClick={() => handleOpen(lecture)}>Открыть</button>
                                <button className={common.view_btn} onClick={() => handleOpenEdit(lecture)}>Изменить</button>
                                <button className={common.delete_btn} onClick={() => handleDelete(lecture)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка без изменений */}
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