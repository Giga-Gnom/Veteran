import React from "react";
import styles from "./PartnerBlock.module.css"

const PartnerBlock = ({partner, onClick}) => {
    return(
        <div className={styles.container} onClick={onClick} >
            <div className={styles.container_image}>
                <img className={styles.container_image_image} src={partner.image} alt="" />
            </div>
            <div className={styles.container_text}>
                <h1>{partner.title}</h1>
            </div>
        </div>
    )
}

export default PartnerBlock;