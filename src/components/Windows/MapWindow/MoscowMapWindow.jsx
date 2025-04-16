import React, { useState } from "react";
import styles from "./MoscowMapWindow.module.css";
import moscowMap from "./srcMaps/Moscow.svg";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import {coordinatArray} from "./coordinatArray";
import DistrictInfoWindow from "./DistrictInfoWindow ";
import MoscowMapSVG from "./MoscowMapSVG";

const MoscoMapWindow = () => {
    const [activeDistrict, setActiveDistrict] = useState(null);
  const [districtInfo, setDistrictInfo] = useState(null);

  const handleDistrictClick = (district) => {
    setActiveDistrict(district.id);
    // Здесь можно добавить запрос к API или использовать локальные данные
    const info = {
      name: district.name,
      population: 750, // Пример данных
      area: 15.6,
      districts: ['Тверской', 'Арбат', 'Хамовники'] // Пример для центра
    };
    setDistrictInfo(info);
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
        
                <DistrictInfoWindow district={districtInfo} />
            </div>

            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
            
    )
}

export default MoscoMapWindow;