import React from "react";
import styles from "./StatisticWindow.module.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from "chart.js";
import { options } from "./options";
import { datas } from "./datas";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import GraphWithLegend from "./GraphWithLegend";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticWindow = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container_head}>            
        <MyHat heading="Статистика"/>
      </div>
      <div className={styles.container_content}>
        <GraphWithLegend/> 
        <br /><br /><br />
      </div>
      <div className={styles.container_bottom}>            
        <BottomPanel/>
      </div>
    </div>
  );
};

export default StatisticWindow;