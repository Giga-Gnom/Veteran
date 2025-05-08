import React from "react";
import styles from "./SZAOorgBlock.module.css"

const SZAOorgBlock = ({org}) => {
    return(
        <div className={styles.block}>
                    <h3>{org.name}</h3>
                    <span><strong>Адрес:</strong> {org.address}</span>
                    <br />
                    <h4>Председатель:</h4>
                    <span>{org.chairman.name}</span > 
                    <span><strong>Телефон:</strong> {org.chairman.phone}</span>
                </div>
    )
}

export default SZAOorgBlock;