import React, { useState } from "react";
import styles from "./MoscowMapWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import MoscowMapSVG from "./MoscowMapSVG";

const MoscoMapWindow = () => {

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Интерактивная карта Москвы"/>
            </div>

            <div className={styles.mapContainer}>
                <MoscowMapSVG 
                
                />
        
            </div>

            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
            
    )
}

export default MoscoMapWindow;