import { useEffect, useRef, useState } from "react";
import styles from "./AdminAwardsWindow.module.css"
import awardsService from "../../../services/awardsService";
import { _descriptors } from "chart.js/helpers";

const AdminAwardsWindow = () => {
    const [loading, setloading] = useState(false)
    const [awards, setAwards] = useState([])
    const [viewingDocument, setViewingDocument] = useState(null); 
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [errors, setErrors] = useState({});
    const [currentAwardId, setCurrentAwardId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        file: null,
        file_name:"",
        description: "",
        image: null,
        image_name: ""
    })
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        loadingAwards()
    }, [])

    const loadingAwards = async () => {
        try{
            setloading(true)
            const awardsData = await awardsService.getAllAwards()
            setAwards(awardsData)
        } catch (error) {
            console.error("error fetching awards: ", error)
        } finally {
            setloading(false)
        }
    }

    const handleOpenForm = () => {
        setFormData({
            title: "",
            file: null,
            file_name:"",
            description: "",
            image: null,
            image_name: ""
        })
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({
            title: "",
            file: null,
            file_name: "",
            description: "",
            image: null,
            image_name: ""
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                file_name: file.name
            }));
            if (errors.file) {
                setErrors(prev => ({
                    ...prev,
                    file: ""
                }));
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (allowedTypes.includes(file.type)) {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    image_name: file.name
                }));
            } else {
                alert("Разрешены только изображения (JPG, PNG, GIF, WebP)");
                e.target.value = "";
            }
        }
    };

    const handleViewDocument = (award) => {
        setViewingDocument(award);
    };

    const handleCloseDocument = () => {
        setViewingDocument(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Введите название награды";
        }
        if (!formData.file) {
            newErrors.file = "Выберите файл документа";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try{
            let fileResult = null
            let imageResult = null

            const arrayBuffer = await formData.file.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)
            fileResult = await window.electronAPI.file.save(formData.file.name, buffer)

            if (formData.image) {
                const imageArrayBuffer = await formData.image.arrayBuffer()
                const imageBuffer = new Uint8Array(imageArrayBuffer)
                imageResult = await window.electronAPI.file.save(formData.image.name, imageBuffer)
            }

            const awardData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                file_name: fileResult.file_name,
                file_path: fileResult.file_path,
                image_path: imageResult ? imageResult.file_path : "",
                upload_date: new Date().toLocaleDateString('ru-RU')
            }

            await awardsService.addAward(awardData)
            handleCloseForm()
            loadingAwards()
        } catch (error) {
            console.error("error saving award: ", error)
        }
    }

    const handleDeleteAward = async (awardId, awardTitle) => {
        if(!window.confirm(`Вы уверены, что хотите удалить награду "${awardTitle}"?`))
            return

        try{
            await awardsService.deleteAward(awardId)
            loadingAwards()
        } catch (error) {
            console.error("Error deleting award:", error);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString('ru-RU');
        } catch (error) {
            return dateString;
        }
    };

    if (viewingDocument) {
        return (
            <div className={styles.document_viewer_container}>
                <div className={styles.document_header}>
                    <h2 className={styles.document_title}>{viewingDocument.title}</h2>
                    <button 
                        className={styles.document_close_btn}
                        onClick={handleCloseDocument}
                    >
                        ← Назад к списку
                    </button>
                </div>
                <div className={styles.document_content}>
                    <iframe 
                        src={viewingDocument.file_path} 
                        title={viewingDocument.title}
                        className={styles.document_iframe}
                        type="application/pdf"
                    />
                </div>
            </div>
        );
    }

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление наградами</h1>
                <button 
                    className={styles.add_btn}
                    onClick={handleOpenForm}
                >
                    + Добавить награду
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <p>Загрузка наград...</p>
                    </div>
                ) : awards.length === 0 ? (
                    <div className={styles.empty_state}>
                        <div className={styles.empty_icon}>🏆</div>
                        <p className={styles.empty_text}>Нет добавленных наград</p>
                        <button 
                            className={styles.empty_btn}
                            onClick={handleOpenForm}
                        >
                            + Добавить первую награду
                        </button>
                    </div>
                ) : (
                    <div className={styles.awards_grid}>
                        {awards.map((award) => (
                            <div key={award.id} className={styles.award_card}>
                                <div className={styles.award_header}>
                                    <h3 className={styles.award_title}>{award.title}</h3>
                                    {award.image_path && (
                                        <div className={styles.award_image_preview}>
                                            <img 
                                                src={award.image_path} 
                                                alt={award.title}
                                                className={styles.award_image}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.award_info}>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Файл:</span>
                                        <span className={styles.info_value}>{award.file_name}</span>
                                    </div>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Дата добавления:</span>
                                        <span className={styles.info_value}>{formatDate(award.upload_date)}</span>
                                    </div>
                                </div>

                                <div className={styles.award_actions}>
                                    <button 
                                        className={`${styles.action_btn} ${styles.view_btn}`}
                                        onClick={() => handleViewDocument(award)}
                                    >
                                        Просмотреть
                                    </button>
                                    <button 
                                        className={`${styles.action_btn} ${styles.delete_btn}`}
                                        onClick={() => handleDeleteAward(award.id, award.title)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className={styles.modal_overlay} onClick={handleCloseForm}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h2 className={styles.modal_title}>Добавить награду</h2>
                            <button 
                                className={styles.modal_close}
                                onClick={handleCloseForm}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.form_group}>
                                <label htmlFor="title" className={styles.form_label}>
                                    Название награды *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`${styles.form_input} ${errors.title ? styles.error : ''}`}
                                    placeholder="Введите название награды"
                                />
                                {errors.title && (
                                    <span className={styles.error_message}>{errors.title}</span>
                                )}
                            </div>

                            <div className={styles.form_group}>
                                <label htmlFor="description" className={styles.form_label}>
                                    Описание (опционально)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={styles.form_input}
                                    placeholder="Введите описание награды"
                                    rows="3"
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label htmlFor="file" className={styles.form_label}>
                                    Файл документа *
                                </label>
                                <div className={styles.file_upload}>
                                    <input
                                        type="file"
                                        id="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className={styles.file_input}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <button
                                        type="button"
                                        className={styles.file_btn}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Выберите файл (PDF, DOC, DOCX)
                                    </button>
                                    {formData.file_name && (
                                        <div className={styles.file_selected}>
                                            Выбран: {formData.file_name}
                                        </div>
                                    )}
                                </div>
                                {errors.file && (
                                    <span className={styles.error_message}>{errors.file}</span>
                                )}
                            </div>

                            <div className={styles.form_group}>
                                <label htmlFor="image" className={styles.form_label}>
                                    Изображение (превью, опционально)
                                </label>
                                <div className={styles.file_upload}>
                                    <input
                                        type="file"
                                        id="image"
                                        ref={imageInputRef}
                                        onChange={handleImageChange}
                                        className={styles.file_input}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        className={styles.file_btn}
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        Выберите изображение
                                    </button>
                                    {formData.image_name && (
                                        <div className={styles.file_selected}>
                                            Выбрано: {formData.image_name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.form_actions}>
                                <button
                                    type="button"
                                    className={styles.cancel_btn}
                                    onClick={handleCloseForm}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submit_btn}
                                >
                                    Добавить награду
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAwardsWindow;