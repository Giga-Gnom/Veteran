import React from "react";
import styles from "./FolderBlock.module.css";
import { handleImgClick } from "../../../app/utils";
import { useNavigate } from "react-router-dom";

const FolderBlock = ({event}) => {

      const navigate = useNavigate();

    const onClick = () => {
        const currentSlide = sessionStorage.getItem("eventsCarouselSlide") || "0"
        sessionStorage.setItem("eventsCarouselSlide", currentSlide)
        sessionStorage.setItem("fromEventDepartment", "true")
        console.log("Переход из карусели, сохранен слайд:", currentSlide) // Добавьте для отладки
        navigate(`/gallery/${encodeURIComponent(event.name)}`, {state: {fromEventDepartment: true}})
    }
    return(
        <div className={styles.container} onClick={onClick}>
            <img className={styles.container_image} src={event.img} alt=""/>
            <div className={styles.container_text}>{event.name}</div>
        </div>
    )
}

export default FolderBlock;