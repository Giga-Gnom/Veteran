import React from "react";
import image from "./srcStandarts/standartImage.png"
import styles from "./StandartDocumentBlock.module.css"

const StandartDocumentBlock = ({path, title, onClick}) => {
    return(
        <div className={styles.container} onClick={onClick}>
        <img className={styles.container_image} src={image} alt="" />
        <p className={styles.container_text}>{title}</p>
    </div>
    )
}

export default StandartDocumentBlock;