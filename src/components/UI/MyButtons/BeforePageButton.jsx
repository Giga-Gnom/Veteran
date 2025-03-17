import React from "react";
import styles from "./stylesUI.module.css"

const BeforePageButton = ({onClick}) => {
    return(
        <button className={styles.BeforePageButton} onClick={onClick}></button>
    )
}

export default BeforePageButton;