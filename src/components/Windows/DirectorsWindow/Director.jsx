import React from "react";
import styles from "./Director.module.css"
import image from "../DirectorsWindow/srcDirectors/Akchurin.jpg"
import ReadMoreButton from "../../UI/MyButtons/ReadMoreButton";

const Director = ({person}) => {
    return(
        <div className={styles.container}>
            <img className={styles.paint} src={person.img} alt="" />
            <div className={styles.content_text}>
                <div className={styles.content_text_main}>
                    <h1>{person.name}</h1>
                    <p>{person.text}</p>
                </div>
                <ReadMoreButton></ReadMoreButton>
            </div>
        </div>
    )
}



export default Director;