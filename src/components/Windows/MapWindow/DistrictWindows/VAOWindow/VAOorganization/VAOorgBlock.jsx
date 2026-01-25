import React from "react";
import styles from "./VAOorgBlock.module.css"

const VAOorgBlock = ({org}) => {
    return(
        <div className={styles.block}>
                    <h3>{org.head_text}</h3>
                    <span><strong>Адрес:</strong> <br />{org.address}</span>
                    <br />
                    <h4>Председатель:</h4>
                    <span>{org.director}</span > 
                    <span><strong>Телефон:</strong> {org.phone}</span>
                </div>
    )
}

export default VAOorgBlock;