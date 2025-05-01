import React from "react";
import styles from "./SZAOWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "../../districtsArray";

const SZAOWindow = () => {
    const district = districtsArray.find(item => item.id === 'SZAO');

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
                    <svg viewBox="300 40 200 600" className={styles.detailedMap}>
                        {district.area?.map((area) => ( 
                            <g key={area.id}>
                                <path
                                    d={area.path}
                                    className={styles.area}
                                />
                                <text x={area.center.x} y={area.center.y} className={styles.area_label}>
                                    {area.id}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
                <div className={styles.mapContainer_legend}>
                    <div className={styles.mapContainer_legend_title}>
                        <h2 className={styles.mapContainer_legend_title_h2}>
                            {district.title}
                        </h2>                        
                    </div>
                    {district.area.map((area) => (
                        <div className={styles.mapContainer_legend_block} key={area.id}>
                            <p>{area.id}. {area.name}</p>
                        </div>
                    ))}
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

export default SZAOWindow;