import React, { useState } from "react";
import styles from "./MoscowMapWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import MoscowMapSVG from "./MoscowMapSVG";
import { useNavigate } from "react-router-dom";

const MoscoMapWindow = () => {

  const [activeDistrict, setActiveDistrict] = useState(null);
  const navigate = useNavigate();

    const handleDistrictClick = (district) => {
        setActiveDistrict(district.id);
        // Здесь можно добавить дополнительную логику при клике на район
        console.log("Selected district:", district);
        navigate(`/district/${district.id}`);
    };
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Интерактивная карта Москвы"/>
            </div>

            <div className={styles.mapContainer}>
                <MoscowMapSVG 
                onDistrictClick={handleDistrictClick}
                activeDistrict={activeDistrict}
                />
        
            </div>

            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
            
    )
}

export default MoscoMapWindow;