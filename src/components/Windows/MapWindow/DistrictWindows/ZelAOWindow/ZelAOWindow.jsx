import React from "react";
import styles from "./ZelAOWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "../../districtsArray";

const ZelAOWindow = () => {
    const district = districtsArray.find(item => item.id === 'ZelAO');

    if (!district) {
        return <div>Район не найден</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={district.name} />
            </div>
            <div className={styles.mapContainer}>
                <div className={styles.mapContainer_map}>
                    <svg viewBox="230 -10 100 600" className={styles.detailedMap}>
                        {district.area?.map((area) => ( 
                            <path
                                key={area.id}
                                d={area.path}
                                className={styles.area}
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

export default ZelAOWindow;