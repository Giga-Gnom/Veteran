import React from "react";
import styles from "./ContentBlock.module.css";

const ContentBlock = ({name}) => {
    return(
        <div className={styles.container}>
            <p className={styles.container_text}>{name}</p>
        </div>
    )
}

export default ContentBlock;