import React, { useEffect, useState } from "react";
import styles from "./ImageSlider.module.css"

const ImageSlider = ({ slides = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Автоматическая смена слайдов
    useEffect(() => {
        if (slides.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [slides]);

    if (slides.length === 0) {
        return <div className={styles.loading}>Нет слайдов для отображения</div>;
    }

    return(
        <div className={styles.container}>
            <div className={styles.container_images}>
                <img 
                    src={slides[currentIndex]?.image_path} 
                    alt={slides[currentIndex]?.title || "Изображение"}
                    className={styles.slide_image}
                />
            </div>
        </div>
    )
}

export default ImageSlider;