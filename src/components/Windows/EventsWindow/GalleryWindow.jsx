import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MyHat from "../../Hat/MyHat";
import styles from "./GalleryWindow.module.css";
import BottomPanel from "../../BottomPanel/BottomPanel";
import eventsService from "../../../services/eventsService";
import EventBlock from "./EventBlock";
import BeforePageButton from "../../UI/MyButtons/BeforePageButton";

const GalleryWindow = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // ← ДОБАВЬТЕ
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [folderTitle, setFolderTitle] = useState("");

    useEffect(() => {
        if (id) {
            loadFolderData();
        }
    }, [id]);

    const loadFolderData = async () => {
        try {
            setLoading(true);
            
            // Загружаем фото из папки
            const folderImages = await eventsService.getAllImagesFormFolder(parseInt(id));
            console.log("id ", id)
            setImages(folderImages);
            
            // Получаем название папки
            const folders = await eventsService.getAllFolders();
            const currentFolder = folders.find(f => f.id === parseInt(id));
            if (currentFolder) {
                setFolderTitle(currentFolder.title);
            }
            
        } catch (error) {
            console.error("Error loading gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/events');
    };

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={`Галерея: ${folderTitle}`} />
            </div>
            
            <div className={styles.container_content}>              
                {loading ? (
                    <div className={styles.loading}>Загрузка фото...</div>
                ) : images.length === 0 ? (
                    <div className={styles.empty}>Нет фото в этой папке</div>
                ) : (
                    <div className={styles.container_content}>
                        {images.map((image, index) => (
                            <EventBlock event={image}/>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.container_bottom}>
                <BeforePageButton onClick={handleBack}/>
            </div>
        </div>
    );
};

export default GalleryWindow;