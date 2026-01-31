import React, { useEffect, useState } from "react";
import styles from "./EventsWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import FolderBlock from "./FolderBlock";
import ImageSlider from "./ImageSlider";
import eventsService from "../../../services/eventsService"; // ← ДОБАВЬТЕ
import Carousel3d from "../../UI/Carousel3d/Carousel3d";

const EventsWindow = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Загружаем папки для карусели
      const foldersData = await eventsService.getAllFolders();
      setFolders(foldersData);
      
      // Загружаем слайды для слайдера
      const slidesData = await eventsService.getAllSlides();
      setSliderImages(slidesData);
      
    } catch (error) {
      console.error("Error loading events data:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (folders.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % folders.length);
  };

  const prevSlide = () => {
    if (folders.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + folders.length) % folders.length);
  };

  if (loading) {  // ← ИСПРАВЛЕНО: добавьте закрывающую скобку
    return (
      <div className={styles.container}>
        <div className={styles.container_head}>
          <MyHat heading="Наши Мероприятия" />
        </div>
        <div className={styles.loading}>
          Загрузка...
        </div>
      </div>
    );
  }  // ← ЗАКРЫВАЮЩАЯ СКОБКА

  return (
    <div className={styles.container}>
      <div className={styles.container_head}>
        <MyHat heading="Наши Мероприятия" />
      </div>
      
      <div className={styles.container_content}>
        {/* Карусель папок */}
        <div className={styles.container_content_carousel}>
          {folders.length === 0 ? (
            <div className={styles.empty}>Нет папок</div>
          ) : (
            <Carousel3d gap={-20}>
              {folders.map((folder) => (
                <FolderBlock key={folder.id} folder={folder}/>
              ))}
            </Carousel3d>
          )}
        </div>
        
        {/* Слайдер изображений */}
        <div className={styles.container_content_slider}>
          <ImageSlider slides={sliderImages} />
        </div>
      </div>
      
      <div className={styles.container_bottom}>
        <BottomPanel />
      </div>
    </div>
  );
};

export default EventsWindow;