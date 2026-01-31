import React, { lazy } from "react";
import styles from "./EventBlock.module.css";
import { handleImgClick } from "../../../app/utils";

const EventBlock = ({event}) => {
    return(
        <div className={styles.container}>
            <img loading={lazy} className={styles.container_image} src={event.image} alt="" onClick={handleImgClick}/>
            {/* <div className={styles.container_text}>{event.name}</div> */}

        </div>
    )
}

export default EventBlock;