import React from "react";
import styles from "./MgsvBlock.module.css"

const MgsvBlock = ({person}) => {
    return(
        <div className={styles.container}>
            <h1 style={{paddingLeft:"2vw"}}>{person.name}</h1>
            <p>{person.position}</p>
        </div>
    )
}

export default MgsvBlock;