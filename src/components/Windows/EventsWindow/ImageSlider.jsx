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

    if (images.length === 0) {
        return <div>Загрузка...</div>;
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return(
        <div className={styles.container}>
            <div className={styles.container_images}>
                <img src={images[currentIndex].image} alt="" />
                <p>{images[currentIndex].name}</p>
            </div>
            <div className={styles.container_arrows}>
                <button onClick={prevSlide}>Назад</button>
                <button onClick={nextSlide}>Вперед</button>
            </div>
        </div>
    )
}

export default ImageSlider