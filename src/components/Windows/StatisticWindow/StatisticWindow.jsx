import React from "react";
import styles from "./StatisticWindow.module.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from "chart.js";
import { options } from "./options";
import { datas } from "./datas";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";

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
        <MyHat heading="Нормативные Документы"/>
      </div>
      <div className={styles.container_content}>
        <div className={styles.container_content_graph}>
          {datas.map((data, index) => <Bar key={index} data={data} options={options} />)}
        </div>
      </div>
      <div className={styles.container_head}>            
        <BottomPanel/>
      </div>
    </div>
  );
};

export default StatisticWindow;