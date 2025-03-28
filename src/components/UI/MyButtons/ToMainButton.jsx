import React from "react";
import styles from "./stylesUI.module.css"

const ToMainButton = ({onClick}) => {
    return(
        <button className={styles.ToMainButton} onClick={onClick}></button>
    )
}

export default ToMainButton;