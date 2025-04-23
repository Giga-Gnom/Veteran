import React from "react";
import styles from "./MapTwoWindow.module.css";
import { Link, useParams } from "react-router-dom";
import MyHat from "../../Hat/MyHat";
import BeforePageButton from "../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "./districtsArray";

const MapTwoWindow = () => {
    const { id } = useParams();
    const district = districtsArray.find(item => item.id === id);

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
                <MyHat heading={district.title} /> {/* Исправлено с commission.title на district.title */}
            </div>
            <div className={styles.mapContainer}>
                <svg viewBox="0 0 800 600" className={styles.detailedMap}>
                    {district.area?.map((area) => ( // Добавлен optional chaining на случай отсутствия areas
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
            <div className={styles.container_button}>
                <Link to="/map">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default MapTwoWindow;