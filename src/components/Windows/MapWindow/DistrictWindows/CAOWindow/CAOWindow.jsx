import React from "react";
import styles from "./CAOWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "../../districtsArray";

const CAOWindow = () => {
    const district = districtsArray.find(item => item.id === 'CAO');

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
                    <svg viewBox="450 100 200 300" className={styles.detailedMap}>
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

export default CAOWindow;