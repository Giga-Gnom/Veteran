import React from "react";
import styles from "./ZAOStatisticWindow.module.css"
import StatisticBlock from "./StatisticBlock";
import { ZAOdataStats } from "./ZAOdataStats";
import BottomPanel from "../../../../../BottomPanel/BottomPanel";
import MyHat from "../../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";

const ZAOStatisticWindow = () => {
    return(
    <div className={styles.container}>
      <div className={styles.container_head}>            
        <MyHat heading="Статистика Западного административного округа"/>
      </div>
      <div className={styles.container_content}>
        <h5 style={{marginBottom: '4vh', fontSize: '4vh', color: 'black'}}>Данные о первичных организациях Западного административного округа не добавлены</h5>
        {ZAOdataStats.map((data, index) => (
          <StatisticBlock key={index} data={data}/>
        ))}
      </div>
      <div className={styles.container_button}>
        <Link to="/district/west">
          <BeforePageButton/>
        </Link>
      </div>
    </div>
    )
}

export default ZAOStatisticWindow;