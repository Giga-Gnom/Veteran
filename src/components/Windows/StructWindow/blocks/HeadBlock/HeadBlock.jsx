import React from "react";
import styles from "./HeadBlock.module.css";

const HeadBlock = ({name}) => {
    return(
        <div className={styles.container}>
            <p className={styles.container_text}>{name}</p>
        </div>
    )
}

export default HeadBlock;