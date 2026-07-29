// components/AdminWindows/AdminStandartWindow/AdminStandartWindow.jsx
import { useEffect, useState } from "react";
import standartDocumentService from "../../../services/standartDocumentService";
import styles from "./AdminStandartWindow.module.css"
import { FileInput } from "../admin_components/FileInput";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const AdminStandartWindow = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [documents, setDocuments] = useState([])
    const [showDocument, setShowDocument] = useState(false)
    const [showingDoc, setShowingDoc] = useState(null)
    const [data, setData] = useState({
        title: "",
        file_name: "", //имя уникальное для файла
        upload_date: "",
        file_path: ""
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        loadDocuments()
    },[])

    const loadDocuments = async () => {
        try {
            const docs = await standartDocumentService.getAllDocuments()
            setDocuments(docs)
        } catch (error) {
            console.log(error)
        }
    }

    const showError = (message) => {
        setError(message)
    }

    const clearError = () => {
        setError(null)
    }

    const handleOpenForm = () => {
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setData({
            file_name: "",
            file_path: "",
            upload_date: "",
            title: ""
        })
        setSelectedFile(null)
    }

    const handleTitleChange = (e) => {
        setData(prev => ({
            ...prev,
            title: e.target.value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const allowedTypes = ['pdf']
            const fileExtension = file.name.split('.').pop().toLowerCase()
            if (allowedTypes.includes(fileExtension)){
                setSelectedFile(file)
                setData(prev => ({
                    ...prev,
                    file_name: file.name
                }))
            } else {
                showError("разрешены только pdf")
                e.target.value = ""
            }
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (!data.title.trim()){
            showError("введите название для документа")
            return
        }

        if (!selectedFile){
            showError("выберете файл")
            return
        }

        try{

            const arrayBuffer = await selectedFile.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const fileResult = await window.electronAPI.file.save(selectedFile.name, buffer)

            console.log("file save: ", fileResult)

            const documentData = {
                title: data.title,
                upload_date: new Date().toISOString(),
                file_name: fileResult.file_name,
                file_path: fileResult.file_path
            }

            const result = await standartDocumentService.addDocument(documentData)

            if (result){
                showError("Документ успешно сохранен")
                handleCloseForm()
                loadDocuments()
            } else {
                console.error(error)
                showError("Ошибка при сохранении документа")
            }
        } catch (error) {
            console.log(error)
            showError("Ошибка при сохранении: " + error.message)
        }
    }

    const handleShowDocument = (document) => {
        setShowingDoc(document)
        setShowDocument(true)
    }

    const handleCloseShowingDocument = () => {
        setShowDocument(false)
        setShowingDoc(null)
    }

    const handleDeleteDocument = async (document) => {
        const confirmed = await showConfirm("Вы уверены?");
        if (!confirmed) return;

        try {
            await standartDocumentService.deleteDocument(document.id)
            loadDocuments()
        } catch (error) {
            console.log("Ошибка удаления: ", error)
            showError("Ошибка удаления документа")
        }
    }

    return (
        <div className={styles.contant}>
            {error && (
                <ErrorMassage 
                    message={error} 
                    onClose={clearError}
                />
            )}

            {showDocument && showingDoc && (
                <div>
                    <div>
                        <div>
                            <span>{showingDoc.title}</span>
                            <button className={styles.simple_button_for_standartadmin} onClick={handleCloseShowingDocument}>Закрыть</button>
                        </div>
                        <iframe 
                        src={showingDoc.file_path || ""} 
                        title={showingDoc.title}
                        style={{
                            width: '100%',
                            height: '63vh',
                            border: 'none'}}></iframe>
                    </div>
                </div>
            )}
            {!isFormOpen &&
            <div>
                <div className={styles.content_wrapper}>
                    <div className={styles.flex_column_center}>
                        <button
                        className={styles.open_form_button}
                        onClick={handleOpenForm}
                        >Открыть форму</button>
                    </div>
                </div>
                <div className={styles.array_container}>
                    {Array.isArray(documents) && documents.length > 0 && documents.map((doc, index) => (
                        <div key={index} className={styles.doc_block} >
                            <div className={styles.doc_block_text} onClick={()=>handleShowDocument(doc)}>
                                {doc.title}
                            </div>
                            <button className={styles.delete_document_button} onClick={() => handleDeleteDocument(doc)}>Удалить</button>
                        </div>
                    ))}
                </div>
            </div>

            }
            {isFormOpen &&
                <form className={styles.add_form} onSubmit={handleSave}>            
                    <input 
                    type="text"
                    placeholder="Заголовок для документа"
                    value={data.title}
                    onChange={handleTitleChange}
                    required
                    className={styles.file_title_input} />
                    <FileInput onChange={handleFileChange} id={"document"}/>
                    <div className={styles.buttons_block}>
                        <button
                        type="submit"
                        className={styles.save_button}
                        >
                            Сохранить
                        </button>
                        <button
                        type="button"
                        className={styles.save_button}
                        onClick={handleCloseForm}
                        >
                            Закрыть
                        </button>
                    </div>
                </form>
            }
        </div>
    );
}

export default AdminStandartWindow;