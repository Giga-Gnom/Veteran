import React from "react";
import styles from "./StandartDocumentBlock.module.css"

const StandartDocumentBlock = ({standart, onClick}) => {
    return(
        <div className={styles.container} onClick={onClick}>
        <img className={styles.container_image} src={standart.image} alt="" />
        <p className={styles.container_text}>{standart.title}</p>
    </div>
    )
}

export default StandartDocumentBlock;