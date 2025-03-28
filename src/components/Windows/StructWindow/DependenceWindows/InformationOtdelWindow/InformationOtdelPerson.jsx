import React from "react";
import styles from "./InformationOtdelPerson.module.css"

const InformationOtdelPerson = ({person}) => {
    return(
        <div className={styles.container}>
            <div className={styles.container_img}>
                <img src={person.image} alt="" />
            </div>
            <div className={styles.container_text}>
                <p>{person.role}</p>
                <h2>{person.name}</h2>
                <p>{person.text}</p>
            </div>
        </div>
    )
}

export default InformationOtdelPerson;