import React from "react";
import styles from "./TroAndNovAOStatisticWindow.module.css"
import StatisticBlock from "./StatisticBlock";
import BottomPanel from "../../../../../BottomPanel/BottomPanel";
import MyHat from "../../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { TroAndNovAOdataStats } from "./TroAndNovAOdataStats";

const TroAndNovAOStatisticWindow = () => {
  const {troick} = useParams();
  const isTroick = troick === "true"
    return(
    <div className={styles.container}>
      <div className={styles.container_head}>            
        <MyHat heading="Статистика Троицкого и Новомосковского административного округа"/>
      </div>
      <div className={styles.container_content}>
        <h5 style={{marginBottom: '4vh', fontSize: '4vh', color: 'black'}}>Данные о первичных организациях Троицкого и Новомосковсого административных округов не добавлены</h5>
        {TroAndNovAOdataStats.map((data, index) => (
          <StatisticBlock key={index} data={data}/>
        ))}
      </div>
      <div className={styles.container_button}>
        {isTroick ?
          (
            <Link to="/district/troitskiy">
              <BeforePageButton/>
            </Link>
          )
          :
          (
            <Link to="/district/troitskiy">
              <BeforePageButton/>
            </Link>
          )
        }
      </div>
    </div>
    )
}

export default TroAndNovAOStatisticWindow;