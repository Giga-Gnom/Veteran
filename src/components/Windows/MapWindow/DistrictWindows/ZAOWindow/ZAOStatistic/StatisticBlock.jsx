import React from "react";
import styles from "./StatisticBlock.module.css"
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from "chart.js";
import { options } from "./ZAOoptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticBlock = ({data}) => {
    return(
        <div className={styles.container}>
            <Bar data={data} options={options}></Bar>
        </div>
    )
}

export default StatisticBlock;