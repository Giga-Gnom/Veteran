import React from "react";
import styles from "./BuhgalteriaPerson.module.css";

const BuhgalteriaPerson = ({person}) => {
    return(
        <div className={styles.column_container}>
            <div className={styles.container}>
                <img src={person.image} className={styles.container_img} alt="" />
                <div className={styles.container_text}>
                    <p>{person.role}</p>
                    <h2>{person.name}</h2>
                    <p>{person.phone}</p>
                    <p>{person.text}</p>
                </div>
            </div>
            <div className={styles.container_functions}>
                <h2>Функциональные обязанности:</h2>
                {person.functions.map((fun, index) => <p key={index}>{fun}</p>)}
            </div>
        </div>
    )
}

export default BuhgalteriaPerson;