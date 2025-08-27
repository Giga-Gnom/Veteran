import React, { useEffect, useState } from "react";
import styles from "./ImageSlider.module.css"
import { loadImgFromFolder } from "./EventsArray";

const ImageSlider = () => {
    const [images, setImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        async function loadImages() {
            const loadedImages = await loadImgFromFolder('srcEvents');
            setImages(loadedImages);
        }
        loadImages();
    }, [])

    // Автоматическая смена слайдов
    useEffect(() => {
        // Не создаем интервал, если images пустой
        if (images.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [images]); // Зависимость от всего массива images

    if (images.length === 0) {
        return <div>Загрузка...</div>;
    }

    return(
        <div className={styles.container}>
            <div className={styles.container_images}>
                <img src={images[currentIndex].image} alt="" />
                <p>{images[currentIndex].name}</p>
            </div>
        </div>
    )
}

export default ImageSlider