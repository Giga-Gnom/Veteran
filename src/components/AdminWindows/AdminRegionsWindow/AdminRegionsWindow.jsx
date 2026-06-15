import { useEffect, useRef, useState } from "react";
import styles from "./AdminRegionsWindow.module.css"
import regionsService from "../../../services/regionsService";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const AdminRegionsWindow = () => {
    const [regions, setRegions] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [loading, setLoading] = useState()
    const [newRegion, setNewRegion] = useState({
        region_name: "",
        document: null,
        document_name: "",
        logo: null,
        logo_name: ""
    })
    const documentInputRef = useRef()
    const logoInputRef = useRef()

    useEffect(() => {
        loadRegions()
    }, [])

    const loadRegions = async () => {
        try{
            setLoading(true)
            const regionsData = await regionsService.getAllRegions()
            setRegions(regionsData)
        } catch (error) {
            console.error("errror loading regions: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenForm = () => {
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setNewRegion({
            region_name: "",
            document: null,
            document_name: "",
            logo: null,
            logo_name: ""
        })
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setNewRegion(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDocumentChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewRegion(prev => ({
                ...prev,
                document: file,
                document_name: file.name
            }))
        }
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml', 'image/webp']
            if (allowedTypes.includes(file.type)) {
                setNewRegion(prev => ({
                    ...prev,
                    logo: file,
                    logo_name: file.name
                }))
            } else {
                 e.target.value = ""
            }
        }
    }

    const handleAddRegion = async () => {
        if (!newRegion.region_name.trim()) {
            showAlert("Введите название региона")
            return
        }

        if (!newRegion.document) {
            showAlert("Выберите документ региона")
            return
        }

        if (!newRegion.logo) {
            showAlert("Выберите логотип региона")
            return
        }

        try{
            const docArrayBuffer = await newRegion.document.arrayBuffer()
            const docBuffer = new Uint8Array(docArrayBuffer)
            const docResult = await window.electronAPI.file.save(newRegion.document.name, docBuffer)

            // Сохраняем логотип
            const logoArrayBuffer = await newRegion.logo.arrayBuffer()
            const logoBuffer = new Uint8Array(logoArrayBuffer)
            const logoResult = await window.electronAPI.file.save(newRegion.logo.name, logoBuffer)

            const regionData = {
                region_name: newRegion.region_name.trim(),
                document_name: docResult.file_name,
                document_path: docResult.file_path,
                logo_path:logoResult.file_path
            }

            await regionsService.addRegion(regionData)
            loadRegions()
            handleCloseForm()
        } catch (error) {
            console.error("error adding region: ", error)
        }
    }

    const handleDeleteRegion = async (regionId, regionName) => {
        const confirmed = await showConfirm("Вы уверены?");
        if (!confirmed) return;

        try {
            await regionsService.deleteRegion(regionId)
            loadRegions()
            showAlert("Регион удален")
        } catch (error) {
            console.error("error deleting region: ", error)
            showAlert("Ошибка при удалении региона")
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "—"
        try {
            return new Date(dateString).toLocaleDateString('ru-RU')
        } catch (error) {
            return dateString
        }
    }

        return(
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление регионами</h1>
                <button 
                    className={styles.add_button}
                    onClick={handleOpenForm}
                >
                    + Добавить регион
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Загрузка регионов...</div>
            ) : regions.length === 0 ? (
                <div className={styles.empty_state}>
                    <div className={styles.empty_icon}>🗺️</div>
                    <p className={styles.empty_text}>Нет добавленных регионов</p>
                    <button 
                        className={styles.empty_button}
                        onClick={handleOpenForm}
                    >
                        + Добавить первый регион
                    </button>
                </div>
            ) : (
                <div className={styles.regions_grid}>
                    {regions.map((region, i) => (
                        <div key={region.id || i} className={styles.region_card}>
                            <div className={styles.region_header}>
                                <div className={styles.region_logo_container}>
                                    <img 
                                        src={region.logo_path} 
                                        alt={region.region_name}
                                        className={styles.region_logo}
                                    />
                                </div>
                                <h3 className={styles.region_name}>{region.region_name}</h3>
                            </div>
                            
                            <div className={styles.region_info}>
                                <div className={styles.info_row}>
                                    <span className={styles.info_label}>Документ:</span>
                                    <span className={styles.info_value}>{region.document_name}</span>
                                </div>
                                <div className={styles.info_row}>
                                    <span className={styles.info_label}>Добавлен:</span>
                                    <span className={styles.info_value}>{formatDate(region.upload_date)}</span>
                                </div>
                            </div>

                            <div className={styles.region_actions}>
                                <button 
                                    className={`${styles.action_btn} ${styles.view_btn}`}
                                    onClick={() => window.open(region.document_path, '_blank')}
                                >
                                    Просмотреть документ
                                </button>
                                <button 
                                    className={`${styles.action_btn} ${styles.delete_btn}`}
                                    onClick={() => handleDeleteRegion(region.id, region.region_name)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модальное окно добавления региона */}
            {isFormOpen && (
                <div className={styles.modal_overlay} onClick={handleCloseForm}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h2 className={styles.modal_title}>Добавить регион</h2>
                            <button 
                                className={styles.modal_close}
                                onClick={handleCloseForm}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.form}>
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>
                                    Название региона *
                                </label>
                                <input
                                    type="text"
                                    name="region_name"
                                    value={newRegion.region_name}
                                    onChange={handleInputChange}
                                    className={styles.form_input}
                                    placeholder="Например: Московская область"
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>
                                    Документ региона (PDF/DOC) *
                                </label>
                                <div className={styles.file_upload}>
                                    <input
                                        type="file"
                                        ref={documentInputRef}
                                        onChange={handleDocumentChange}
                                        accept=".pdf,.doc,.docx"
                                        className={styles.file_input}
                                    />
                                    <button
                                        type="button"
                                        className={styles.file_btn}
                                        onClick={() => documentInputRef.current?.click()}
                                    >
                                        Выберите документ
                                    </button>
                                    {newRegion.document_name && (
                                        <div className={styles.file_selected}>
                                            Выбран: {newRegion.document_name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>
                                    Логотип региона (изображение) *
                                </label>
                                <div className={styles.file_upload}>
                                    <input
                                        type="file"
                                        ref={logoInputRef}
                                        onChange={handleLogoChange}
                                        accept="image/*"
                                        className={styles.file_input}
                                    />
                                    <button
                                        type="button"
                                        className={styles.file_btn}
                                        onClick={() => logoInputRef.current?.click()}
                                    >
                                        Выберите логотип
                                    </button>
                                    {newRegion.logo_name && (
                                        <div className={styles.file_selected}>
                                            Выбран: {newRegion.logo_name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.form_actions}>
                                <button
                                    className={styles.cancel_btn}
                                    onClick={handleCloseForm}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.save_btn}
                                    onClick={handleAddRegion}
                                >
                                    Добавить регион
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminRegionsWindow;