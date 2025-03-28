import React, { useState } from "react";
import styles from "./MoscowMapWindow.module.css";
import moscowMap from "./srcMaps/moscowmap.png";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import {coordinatArray} from "./coordinatArray";

const MoscoMapWindow = () => {
    const [highlightedArea, setHighlightedArea] = useState(null);

    const handleAreaClick = (area) => {
        if (highlightedArea === area) {
            setHighlightedArea(null);
        } else {
            setHighlightedArea(area);
        }
        console.log(area);
    };

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Интерактивная карта Москвы"/>
            </div>
            <div className={styles.container_content}>
            <img src={moscowMap} useMap="#image-map" />
            <map name="image-map">
                {coordinatArray.map((area, index) => (
                    <area 
                    key={index}
                    target="" 
                    alt={area.alt} 
                    title={area.alt} 
                    href={null} 
                    coords={area.coords} 
                    shape="poly"
                    className={highlightedArea ? styles.highlighted : ""}
                    onClick={() => handleAreaClick(area.alt)}
                />
                ))}
            </map>
            </div>
            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
            
    )
}

export default MoscoMapWindow;