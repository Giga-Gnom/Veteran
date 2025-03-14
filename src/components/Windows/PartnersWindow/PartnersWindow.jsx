import React from "react";
import styles from "./PartnersWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { partnersArray } from "./PartnersArray";
import PartnerBlock from "./PartnerBlock";

const PartnersWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Наши Коллеги, Партнёры, Соратники"/>
            </div>
            <div className={styles.container_content}>
                {partnersArray.map((partner, index) => (<PartnerBlock key={index} partner={partner}/>))}
            </div>
            <div className={styles.container_head}>            
                <BottomPanel/>
            </div>
        </div>
    )
}

export default PartnersWindow;