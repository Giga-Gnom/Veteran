import React from "react";
import styles from'./stylesUI.module.css'

const DropDownButton = ({onClick}) => {
    return(
        <button className={styles.dropMenu} onClick={onClick}></button>        
    )
}

export default DropDownButton;