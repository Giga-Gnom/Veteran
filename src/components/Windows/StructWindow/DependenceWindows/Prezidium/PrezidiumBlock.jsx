import React from "react";
import styles from "./PrezidiumBlock.module.css"

const PrezidiumBlock = ({person}) => {
    return(
        <div className={styles.container}>
            <h1 style={{paddingLeft:"2vw"}}>{person.name}</h1>
            <p>{person.birthDate}</p>
            <p>{person.position}</p>
        </div>
    )
}

export default PrezidiumBlock;