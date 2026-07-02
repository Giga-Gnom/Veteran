import { useEffect, useState } from "react"
import styles from "./AdminEventsWindow.module.css"
import eventsService from "../../../services/eventsService"
import { showConfirm } from "../UI/ConfirmModal/ConfirmModel"

const AdminEventsWindow = () => {
    const [isFolders, setIsFolders] = useState(false)
    const [slides, setSlides] = useState([])
    const [loading, setLoading] = useState(false)
    const [folders, setFolders] = useState([])
    const [isAddSlideOpen, setIsAddSlideOpen] = useState(false)
    const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
    const [newSlide, setNewSlide] = useState({
        files: [],
        title: ""
    })
    const [newFolder, setNewFolder] = useState({
        title: ""
    })
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [folderImages, setFolderImages] = useState([]);
    const [isAddImageOpen, setIsAddImageOpen] = useState(false);
    const [newImage, setNewImage] = useState({
        files:[]
    });

    useEffect(() => {
        if (!isFolders) {
            loadSlides()
        } else {
            loadFolders()
        }
    },[isFolders])

    const loadSlides = async () => {
        try{
            setLoading(true)
            const slidesData = await eventsService.getAllSlides()
            setSlides(slidesData)
        } catch (error) {
            console.error("error loading slides: ", error)
        } finally {
            setLoading(false)
        }
    }

    const loadFolders = async () => {
        try{
            setLoading(true)
            const foldersData = await eventsService.getAllFolders()
            setFolders(foldersData)
        } catch (error) {
            console.error("error loading folders: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSlideClick = () => {
        setIsAddSlideOpen(true)
        setNewSlide({
            files: [],
            title: ""
        })
    }

    const handleAddFolderClick = () => {
        setIsAddFolderOpen(true)
        setNewFolder({
            title: ""
        })
    }

    const handleCloseAddSlide = () => {
        setIsAddSlideOpen(false)
    }

    const handleCloseAddFolder = () => {
        setIsAddFolderOpen(false)
    }

    const handleSlideFileChange = (e) => {
        const fileList = Array.from(e.target.files)
        if (fileList.length === 0){
            return
        }
        setNewSlide(prev => ({
            ...prev,
            files: fileList.map(file => ({file, name: file.name}))
        }))
    }

    const handleSlideInputChange = (e) => {
        const { name, value } = e.target
        setNewSlide(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFolderInputChange = (e) => {
        const { name, value } = e.target
        setNewFolder(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddSlide = async () => {
        if (newSlide.files.length === 0) {
            return;
        }

        try {
            for (const { file } of newSlide.files) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                const fileResult = await window.electronAPI.file.save(file.name, buffer);

                const slideTitle = newSlide.title.trim() 
                    ? newSlide.title.trim() 
                    : file.name.replace(/\.[^/.]+$/, "");

                const slideData = {
                    title: slideTitle,
                    image_path: fileResult.file_path,
                    image_name: fileResult.file_name
                };

                await eventsService.addSlide(slideData);
            }

            handleCloseAddSlide();
            loadSlides();
        } catch (error) {
            console.error("Ошибка при добавлении слайдов:", error);
        }
    };

    const handleAddFolder = async () => {
        if (!newFolder.title.trim()) {
            return
        }

        try {
            const folderData = {
                title: newFolder.title.trim()
            }

            await eventsService.addFolder(folderData)
            handleCloseAddFolder()
            loadFolders()
        } catch (error) {
            console.error("error adding folder: ", error)
        }
    }

    const handleDeleteSlide = async (slideId, slideTitle) => {
        const confirmed = await showConfirm("Вы уверены?");
        if (!confirmed) return;

        try {
            await eventsService.deleteSlide(slideId)
            loadSlides()
        } catch (error) {
            console.error("error deleting slide: ", error)
        }
    }

    const handleDeleteFolder = async (folderId, folderTitle) => {
        const confirmed = await showConfirm("Вы уверены?");
        if (!confirmed) return;

        try {
            await eventsService.deleteFolder(folderId)
            loadFolders()
        } catch (error) {
            console.error("error deleting folder: ", error)
        }
    }

    const handleOpenFolder = async (folder) => {
        setSelectedFolder(folder);
        try {
            setLoading(true);
            const images = await eventsService.getAllImagesFormFolder(folder.id);
            setFolderImages(images);
        } catch (error) {
            console.error("Error loading folder images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddImageClick = () => {
        setIsAddImageOpen(true);
        setNewImage({
            files: []
        });
    };

    const handleAddImage = async () => {
        if (newImage.files.length === 0 || !selectedFolder) return;

        try {
            for (const { file } of newImage.files) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                const fileResult = await window.electronAPI.file.save(file.name, buffer);

                const imageData = {
                    folder_id: selectedFolder.id,
                    image_path: fileResult.file_path,
                    image_name: fileResult.file_name
                };

                await eventsService.addImageIntoFolder(imageData);
            }

            setIsAddImageOpen(false);
            const updatedImages = await eventsService.getAllImagesFormFolder(selectedFolder.id);
            setFolderImages(updatedImages);
        } catch (error) {
            console.error("Ошибка при добавлении фото:", error);
        }
    };

    const handleDeleteImage = async (imageId, imageName) => {
        const confirmed = await showConfirm("Вы уверены?");
        if (!confirmed) return;

        try {
            await eventsService.deleteImage(imageId);
            // Обновляем список фото
            const updatedImages = await eventsService.getAllImagesFormFolder(selectedFolder.id);
            setFolderImages(updatedImages);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleBackToFolders = () => {
        setSelectedFolder(null);
        setFolderImages([]);
    };


    return(
        <div className={styles.container}>
            <div className={styles.container_navigate}>
                <button 
                    className={isFolders ? styles.active_tab : styles.tab}
                    onClick={() => setIsFolders(true)}
                >
                    Папки
                </button>
                <button 
                    className={!isFolders ? styles.active_tab : styles.tab}
                    onClick={() => setIsFolders(false)}
                >
                    Слайдер
                </button>
            </div>

            {isFolders ? (
                selectedFolder ? (
                    <div className={styles.folder_gallery_section}>
                        <div className={styles.gallery_header}>
                            <button 
                                className={styles.back_button}
                                onClick={handleBackToFolders}
                            >
                                ← Назад к папкам
                            </button>
                            <h2>{selectedFolder.title}</h2>
                            <button 
                                className={styles.add_button}
                                onClick={handleAddImageClick}
                            >
                                + Добавить фото
                            </button>
                        </div>
                        
                        {loading ? (
                            <div className={styles.loading}>Загрузка фото...</div>
                        ) : folderImages.length === 0 ? (
                            <div className={styles.empty}>Нет фото в этой папке</div>
                        ) : (
                            <div className={styles.images_grid}>
                                {folderImages.map((image, i) => (
                                    <div key={image.id || i} className={styles.image_card}>
                                        <img 
                                            src={image.image_path} 
                                            alt={image.image_name}
                                            className={styles.image_preview}
                                        />
                                        <div className={styles.image_name}>{image.image_name}</div>
                                        <button 
                                            className={styles.delete_button}
                                            onClick={() => handleDeleteImage(image.id, image.image_name)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.folder_section}>
                        <button 
                            className={styles.add_button}
                            onClick={handleAddFolderClick}
                        >
                            Добавить папку
                        </button>
                        
                        {loading ? (
                            <div className={styles.loading}>Загрузка...</div>
                        ) : folders.length === 0 ? (
                            <div className={styles.empty}>Нет папок</div>
                        ) : (
                            <div className={styles.folders_list}>
                                {folders.map((folder, i) => (
                                    <div 
                                        key={folder.id || i} 
                                        className={styles.folder_card}
                                        onClick={() => handleOpenFolder(folder)}
                                    >
                                        <div className={styles.folder_icon}>📁</div>
                                        <div className={styles.folder_title}>{folder.title}</div>
                                        <button 
                                            className={styles.delete_button}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteFolder(folder.id, folder.title);
                                            }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            ) : (
                <div className={styles.slider_section}>
                    <button 
                        className={styles.add_button}
                        onClick={handleAddSlideClick}
                    >
                        Добавить слайд
                    </button>
                    
                    {loading ? (
                        <div className={styles.loading}>Загрузка...</div>
                    ) : slides.length === 0 ? (
                        <div className={styles.empty}>Нет слайдов</div>
                    ) : (
                        <div className={styles.slides_grid}>
                            {slides.map((slide, i) => (
                                <div key={slide.id || i} className={styles.slide_card}>
                                <div className={styles.slide_card_img_div}>
                                    <img 
                                        src={slide.image_path} 
                                        alt={slide.title || `Слайд ${i+1}`}
                                        className={styles.slide_image}
                                    />
                                </div>
                                    <div className={styles.slide_title}>
                                        {slide.title || slide.image_name}
                                    </div>
                                    <button 
                                        className={styles.delete_button}
                                        onClick={() => handleDeleteSlide(slide.id, slide.title || slide.image_name)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isAddSlideOpen && (
                <div className={styles.modal_overlay} onClick={handleCloseAddSlide}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h3>Добавить слайд</h3>
                            <button 
                                className={styles.close_button}
                                onClick={handleCloseAddSlide}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className={styles.form_group}>
                            <label>Название (опционально)</label>
                            <input
                                type="text"
                                name="title"
                                value={newSlide.title}
                                onChange={handleSlideInputChange}
                                placeholder="Название слайда"
                            />
                        </div>
                        
                        <div className={styles.form_group}>
                            <label>Изображения * (можно выбрать несколько)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleSlideFileChange}
                            />
                            {newSlide.files.length > 0 && (
                                <div className={styles.file_list}>
                                    Выбрано файлов: {newSlide.files.length}
                                    <ul>
                                        {newSlide.files.map((f, idx) => (
                                            <li key={idx}>{f.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.modal_actions}>
                            <button 
                                className={styles.cancel_button}
                                onClick={handleCloseAddSlide}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.save_button}
                                onClick={handleAddSlide}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddFolderOpen && (
                <div className={styles.modal_overlay} onClick={handleCloseAddFolder}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h3>Добавить папку</h3>
                            <button 
                                className={styles.close_button}
                                onClick={handleCloseAddFolder}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className={styles.form_group}>
                            <label>Название папки *</label>
                            <input
                                type="text"
                                name="title"
                                value={newFolder.title}
                                onChange={handleFolderInputChange}
                                placeholder="Название папки"
                            />
                        </div>
                        
                        <div className={styles.modal_actions}>
                            <button 
                                className={styles.cancel_button}
                                onClick={handleCloseAddFolder}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.save_button}
                                onClick={handleAddFolder}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddImageOpen && selectedFolder && (
                <div className={styles.modal_overlay} onClick={() => setIsAddImageOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h3>Добавить фото в "{selectedFolder.title}"</h3>
                            <button 
                                className={styles.close_button}
                                onClick={() => setIsAddImageOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className={styles.form_group}>
                            <label>Изображения * (можно выбрать несколько)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const fileList = Array.from(e.target.files);
                                    if (fileList.length === 0) return;
                                    setNewImage({
                                        files: fileList.map(file => ({ file, name: file.name }))
                                    });
                                }}
                            />
                            {newImage.files.length > 0 && (
                                <div className={styles.file_list}>
                                    Выбрано файлов: {newImage.files.length}
                                    <ul>
                                        {newImage.files.map((f, idx) => (
                                            <li key={idx}>{f.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.modal_actions}>
                            <button 
                                className={styles.cancel_button}
                                onClick={() => setIsAddImageOpen(false)}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.save_button}
                                onClick={handleAddImage}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminEventsWindow