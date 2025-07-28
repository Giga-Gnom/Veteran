import React from "react";
import styles from "./ContentBlock.module.css";
import { Link } from "react-router-dom";

const ContentBlock = ({content, className}) => {
    return(
        <Link to={content.path}>
            <div className={className}>
                <div className={styles.container} >
                    <p className={styles.container_text}>{content.name}</p>
                </div>
            </div>
        </Link>
    )
}

export default ContentBlock;