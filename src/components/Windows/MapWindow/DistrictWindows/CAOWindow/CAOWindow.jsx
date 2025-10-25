import React from "react";
import styles from "./CAOWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link, useNavigate, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { districtsArray } from "../../districtsArray";
import babenko from "./babenko.png"

const CAOWindow = () => {
    const district = districtsArray.find(item => item.id === 'CAO');
    const navigate = useNavigate();

    if (!district) {
        return <div>Район не найден</div>;
    }

    const handleAreaClick = (areaID) => {
        navigate(`/district/central/${areaID}`);
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={district.name} />
            </div>
            <div className={styles.mapContainer}>
                <div className={styles.mapContainer_map}>
                    <svg viewBox="450 120 200 300" className={styles.detailedMap}>
                        {district.area?.map((area) => ( 
                            <g key={area.id}>
                                <path
                                    d={area.path}
                                    className={styles.area}
                                    onClick={() => handleAreaClick(area.id)}
                                />
                                <text x={area.center.x} y={area.center.y} className={styles.area_label}>
                                    {area.id+1}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
                <div className={styles.flex_column}>
                    <div className={styles.area_director_block}>
                        <img src={babenko} alt="" className={styles.person_img}/>
                        <div className={styles.flex_column}>
                            <p><span style={{fontSize: "3vh"}}>Бабенко Евгений Петрович</span></p>
                            <p>Председатель Совета ветеранов Центрального административного округа города Москвы</p>
                            <p>Москва, ул. Новая Басманная, д.37/1, svcao@yandex.ru</p>
                            <p>8-499-263-05-01, 8-499-263-04-90</p>
                        </div>
                    </div>
                    <div className={styles.mapContainer_legend}>
                        <div className={styles.mapContainer_legend_title}>
                            <h2 className={styles.mapContainer_legend_title_h2}>
                                {district.title}
                            </h2>
                        </div>
                        {district.area.map((area) => (
                            <div className={styles.mapContainer_legend_block} key={area.id}>
                                <p>{area.id+1}. {area.name}</p>
                            </div>
                        ))}
                    </div>
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