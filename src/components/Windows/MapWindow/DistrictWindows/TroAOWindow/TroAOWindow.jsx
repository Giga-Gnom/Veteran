import React from "react";
import styles from "./TroAOWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "../../districtsArray";

const TroAOWindow = () => {
    const district = districtsArray.find(item => item.id === 'TroAO');

    if (!district) {
        return <div>Район не найден</div>;
    }

    const handleMouseEnter = (e) => {
        e.target.style.fill = '#ffcc00';
      };
    
      const handleMouseLeave = (e) => {
        if (activeDistrict !== e.target.dataset.id) {
          e.target.style.fill = '#ddff55';
        }
      };

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={district.name} />
            </div>
            <div className={styles.mapContainer}>
                <div className={styles.mapContainer_map}>
                    <svg viewBox="5 270 460 600" className={styles.detailedMap}>
                        {district.area?.map((area) => ( 
                            <path
                                key={area.id}
                                d={area.path}
                                className={styles.area}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </svg>
                </div>
            </div>
            <div className={styles.container_button}>
                <Link to="/map">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default TroAOWindow;