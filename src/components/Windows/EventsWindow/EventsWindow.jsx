import React from "react";
import styles from "./EventsWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { eventsArray } from "./EventsArray";
import EventBlock from "./EventBlock";

const EventsWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Наши Мероприятия"/>
            </div>
            <div className={styles.container_content}>
                {eventsArray.map((event, index) => <EventBlock key={index} event={event}></EventBlock>)}
            </div>
            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
    )
}

export default EventsWindow;