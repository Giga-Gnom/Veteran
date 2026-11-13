import { useEffect, useState } from "react";
import styles from "./AdminSectionDocuments.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import methodicalService from "../../../services/methodicalService";

const AdminSectionDocuments = ({ sectionId, onChanged }) => {
    const [types, setTypes] = useState([])
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingDoc, setEditingDoc] = useState(null)
    const [currentTypeId, setCurrentTypeId] = useState(null)
    const [form, setForm] = useState({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    const [error, setError] = useState(null)
    
    const [bulkLoading, setBulkLoading] = useState(false)

    const showError = (m) => setError(m)
    const clearError = () => setError(null)

    useEffect(() => { loadAll() }, [sectionId])

    const loadAll = async () => {
        try {
            setLoading(true)
            const [typesData, docsData] = await Promise.all([
                methodicalService.getDocumentTypes(),
                methodicalService.getDocumentsBySection(sectionId)
            ])
            setTypes(typesData)
            setDocuments(docsData)
        } catch (e) {
            console.error(e)
            showError("Не удалось загрузить документы")
        } finally {
            setLoading(false)
        }
    }

    // ========== ПЕРЕМЕЩЕНИЕ СТРЕЛОЧКАМИ (ВНУТРИ КОЛОНКИ) ==========
    const handleMoveUp = async (typeId, docId) => {
        // Берем документы только текущей колонки
        const typeDocs = documents.filter(d => d.doc_type_id === typeId);
        const index = typeDocs.findIndex(d => d.id === docId);
        
        if (index <= 0) return; // Уже наверху

        // Меняем местами
        const newTypeDocs = [...typeDocs];
        [newTypeDocs[index - 1], newTypeDocs[index]] = [newTypeDocs[index], newTypeDocs[index - 1]];

        // Собираем общий массив (документы других колонок не трогаем)
        const otherDocs = documents.filter(d => d.doc_type_id !== typeId);
        setDocuments([...otherDocs, ...newTypeDocs]);

        try {
            const orderedIds = newTypeDocs.map(d => d.id);
            await methodicalService.updateDocumentOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }

    const handleMoveDown = async (typeId, docId) => {
        const typeDocs = documents.filter(d => d.doc_type_id === typeId);
        const index = typeDocs.findIndex(d => d.id === docId);
        
        if (index === -1 || index === typeDocs.length - 1) return; // Уже внизу

        const newTypeDocs = [...typeDocs];
        [newTypeDocs[index + 1], newTypeDocs[index]] = [newTypeDocs[index], newTypeDocs[index + 1]];

        const otherDocs = documents.filter(d => d.doc_type_id !== typeId);
        setDocuments([...otherDocs, ...newTypeDocs]);

        try {
            const orderedIds = newTypeDocs.map(d => d.id);
            await methodicalService.updateDocumentOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }
    // =========================================================

    const resetForm = () => {
        setEditingDoc(null)
        setCurrentTypeId(null)
        setForm({ title: "", external_url: "", file_name: null, file_path: null, new_file: null })
    }

    const handleOpenAdd = (typeId) => {
        resetForm()
        setCurrentTypeId(typeId)
        setShowModal(true)
    }

    const handleOpenEdit = (doc) => {
        setEditingDoc(doc)
        setCurrentTypeId(doc.doc_type_id)
        setForm({
            title: doc.title,
            external_url: doc.external_url ?? "",
            file_name: doc.file_name,
            file_path: doc.file_path,
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

    const handleOpen = async (doc) => {
        try {
            if (doc.file_path) {
                if (!window.electronAPI?.file?.open) {
                    showError("IPC-метод file.open не найден. Перезапустите приложение.")
                    return
                }
                const result = await window.electronAPI.file.open(doc.file_path)
                if (!result.success) {
                    showError(`Не удалось открыть файл: ${result.error}`)
                }
            } else if (doc.external_url) {
                window.open(doc.external_url, "_blank", "noopener,noreferrer")
            } else {
                showError("У документа нет ни файла, ни ссылки")
            }
        } catch (e) {
            console.error(e)
            showError("Ошибка при открытии документа")
        }
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
                doc_type_id: currentTypeId,
                title: form.title.trim(),
                external_url: form.external_url.trim() || null,
                file_path,
                file_name
            }

            if (editingDoc) {
                await methodicalService.updateDocument(editingDoc.id, payload)
                showAlert("Документ обновлён")
            } else {
                await methodicalService.addDocument(payload)
                showAlert("Документ добавлен")
            }
            handleCloseModal()
            await loadAll()
            onChanged?.()
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении")
        }
    }

    const handleBulkUpload = async (e, typeId) => {
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
                    section_id: sectionId,
                    doc_type_id: typeId,
                    title: title,
                    external_url: null,
                    file_name: saved.file_name,
                    file_path: saved.file_path
                }

                await methodicalService.addDocument(payload)
                successCount++
            }

            if (successCount > 0) {
                showAlert(`Успешно загружено документов: ${successCount}`)
                await loadAll()
                onChanged?.()
            }
        } catch (err) {
            console.error("Bulk upload error:", err)
            showError("Произошла ошибка при массовой загрузке файлов")
        } finally {
            setBulkLoading(false)
            e.target.value = ""
        }
    }

    const handleDelete = async (doc) => {
        const confirmed = await showConfirm(`Удалить документ "${doc.title}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deleteDocument(doc.id)
            await loadAll()
            onChanged?.()
            showAlert("Документ удалён")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении")
        }
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : (
                <div className={styles.columns}>
                    {types.map(type => {
                        const items = documents.filter(d => d.doc_type_id === type.id)
                        return (
                            <div key={type.id} className={styles.column}>
                                <div className={styles.column_header}>
                                    <h4 className={styles.column_title}>{type.title}</h4>
                                    
                                    <div className={styles.column_actions}>
                                        <button className={common.add_btn} onClick={() => handleOpenAdd(type.id)}>
                                            + Один
                                        </button>
                                        
                                        <label className={`${common.add_btn} ${styles.bulk_btn}`}>
                                            {bulkLoading ? "Загрузка..." : "📁 Массово"}
                                            <input
                                                type="file"
                                                multiple
                                                style={{ display: "none" }}
                                                onChange={(e) => handleBulkUpload(e, type.id)}
                                                disabled={bulkLoading}
                                            />
                                        </label>
                                    </div>
                                </div>
                                
                                <div className={styles.column_list}>
                                    {items.length === 0 ? (
                                        <div className={styles.column_empty}>Документов нет</div>
                                    ) : (
                                        items.map((doc, index) => (
                                            <div key={doc.id} className={styles.doc_card}>
                                                
                                                {/* Шапка карточки со стрелочками */}
                                                <div className={styles.doc_top_row}>
                                                    <div className={styles.doc_name}>{doc.title}</div>
                                                    <div className={styles.sort_controls}>
                                                        <button 
                                                            className={styles.sort_btn} 
                                                            onClick={() => handleMoveUp(type.id, doc.id)} 
                                                            disabled={index === 0}
                                                        >
                                                            ⬆️
                                                        </button>
                                                        <button 
                                                            className={styles.sort_btn} 
                                                            onClick={() => handleMoveDown(type.id, doc.id)} 
                                                            disabled={index === items.length - 1}
                                                        >
                                                            ⬇️
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={styles.doc_meta}>
                                                    {doc.file_name ? (
                                                        <span className={styles.doc_file}>📄 {doc.file_name}</span>
                                                    ) : (
                                                        <a href={doc.external_url} target="_blank" rel="noreferrer" className={styles.doc_url}>
                                                            🔗 внешняя ссылка
                                                        </a>
                                                    )}
                                                </div>
                                                <div className={styles.doc_actions}>
                                                    <button className={common.open_btn} onClick={() => handleOpen(doc)}>Открыть</button>
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
            )}

            {/* Модалка остается без изменений */}
            {showModal && (
                <div className={common.modal_overlay} onClick={handleCloseModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>
                            {editingDoc
                                ? "Редактировать документ"
                                : `Добавить в «${types.find(t => t.id === currentTypeId)?.title ?? ''}»`}
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
                                value={currentTypeId ?? ""}
                                onChange={(e) => setCurrentTypeId(Number(e.target.value))}
                            >
                                {types.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
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

export default AdminSectionDocuments