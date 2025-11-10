import React from "react";
import styles from "./ContentBlock.module.css";
import { Link } from "react-router-dom";

const ContentBlock = ({content, className}) => {
    const haveRedirect = content && content.path && content.path !== "#";
    const blockClassName = haveRedirect ? `${styles.container} ${styles.green_border}` : styles.container;
    
    const handleClick = () => {
        sessionStorage.setItem("fromDepartment", "true")
    }

    return(
        <Link to={content.path} state={{fromDepartment: true}} onClick={handleClick}>
            <div className={className}>
                <div className={blockClassName} >
                    <p className={styles.container_text}>{content.name}</p>
                </div>
            </div>
        </Link>
    )
}

export default ContentBlock;