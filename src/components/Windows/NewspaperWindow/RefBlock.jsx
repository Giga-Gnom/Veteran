import React from "react";
import styles from "./RefBlock.module.css"

const RefBlock = ({title,onClick}) => {
    return(
        <div className={styles.container} onClick={onClick}>
            <p>{title}</p>
        </div>
    )
}

export default RefBlock;