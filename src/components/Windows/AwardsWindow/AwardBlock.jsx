import React from "react";
import styles from "./AwardBlock.module.css";

const AwardBlock = ({award, onClick}) => {
    return(
        <div className={styles.container} onClick={onClick}>
            <img className={styles.container_image} src={award.image} alt="" />
            <div className={styles.container_text}>
                <h1 className={styles.container_text_h1}>{award.name}</h1>
                <p className={styles.container_text_p}>{award.text}</p>
            </div>
        </div>
    )
}

export default AwardBlock;