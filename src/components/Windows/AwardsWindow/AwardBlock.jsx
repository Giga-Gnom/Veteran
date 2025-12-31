import React from "react";
import styles from "./AwardBlock.module.css";

const AwardBlock = ({award, onClick}) => {
    return(
        <div className={styles.container} onClick={onClick}>
            <img className={styles.container_image} src={award.image_path} alt="" />
            <div className={styles.container_text}>
                <h1 className={styles.container_text_h1}>{award.title}</h1>
                <p className={styles.container_text_p}>{award.description}</p>
            </div>
        </div>
    )
}

export default AwardBlock;