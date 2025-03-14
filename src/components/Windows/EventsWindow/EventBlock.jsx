import React from "react";
import styles from "./EventBlock.module.css";

const EventBlock = ({event}) => {
    return(
        <div className={styles.container}>
            <img className={styles.container_image} src={event.image} alt="" />
            <div className={styles.container_text}>{event.name}</div>

        </div>
    )
}

export default EventBlock;