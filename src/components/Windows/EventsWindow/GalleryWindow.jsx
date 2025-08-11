import React, { useEffect, useState } from "react";
import MyHat from "../../Hat/MyHat";
import styles from "./GalleryWindow.module.css";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../UI/MyButtons/BeforePageButton";
import EventBlock from "./EventBlock";
import { loadImgFromFolder } from "./EventsArray";

const GalleryWindow = () => {
    const {folderName} = useParams();

    const [eventsArray, setEventsArray] = useState([]);

    useEffect(()=> {
        if(folderName){
            loadImgFromFolder(folderName).then(setEventsArray)
        }
    })
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Наши Мероприятия" />
            </div>
            <div className={styles.container_content}>
                {eventsArray.map((e, i) => <EventBlock event={e} key={i}/>)}
            </div>
            <div className={styles.container_bottom}>
                <Link to={"/events"}>
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default GalleryWindow;