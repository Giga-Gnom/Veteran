import React from "react";
import styles from "./ContentBlock.module.css";
import { Link } from "react-router-dom";

const ContentBlock = ({content}) => {
    return(
        <Link to={content.path}>
            <div className={styles.container} >
                <p className={styles.container_text}>{content.name}</p>
            </div>
        </Link>
    )
}

export default ContentBlock;