import React from "react";
import styles from "./GraphWithLegend.module.css"
import { datas } from "./datas";
import { Bar } from "react-chartjs-2";
import { options } from "./options";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from "chart.js";
import LegendBlock from "./LegendBlock";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphWithLegend = () =>{
    return(
        <div className={styles.container}>
            {datas.map((data, index) => (
                <div key={index} className={styles.container_graph_block}>
                    <div className={styles.container_graph}>
                        <Bar data={data} options={options}/>
                    </div>
                    <div className={styles.container_legend}>
                        <LegendBlock datasets={data.datasets}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GraphWithLegend;