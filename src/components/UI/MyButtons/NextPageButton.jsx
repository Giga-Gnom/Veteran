import React from "react";
import styles from "./stylesUI.module.css"

const NextPageButton = ({onClick}) => {
    return(
        <button className={styles.NextPageButton} onClick={onClick}></button>
    )
}

export default NextPageButton;