import React, { useEffect, useState } from "react";
import styles from "./GraphWithLegend.module.css"
import { datas } from "./datas";
import { Bar } from "react-chartjs-2";
import { options } from "./options";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from "chart.js";
import LegendBlock from "./LegendBlock";
import statisticsService from "../../../services/statisticsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphWithLegend = () =>{
    const [datasDB, setDatasDB] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadChartsData()
    }, [])

    const loadChartsData = async () => {
        try{
            setLoading(true)
            const chartsData = await statisticsService.getAllFullCharts()
            const transformadData = chartsData.map(chart => ({
                chartName: chart.chart_name,
                labels: chart.labels,
                datasets: chart.datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: dataset.backgroundColor,
                    borderColor: dataset.borderColor,
                    borderWidth: 1
                }))
            }))
            setDatasDB(transformadData)
            setError(null)
        } catch (error) {
            console.error("Ошибка загрузки графиков:", error);
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className={styles.loading}>Загрузка графиков...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (datas.length === 0) {
        return <div className={styles.noData}>Нет данных для отображения графиков</div>;
    }
    return(
        <div className={styles.container}>
            {datasDB.map((data, index) => (
                <div key={index} className={styles.container_graph_block_first}>
                    <h1>{data.chartName}</h1>
                    <div className={styles.container_graph_block}>
                        <div className={styles.container_graph}>
                            <Bar data={data} options={options}/>
                        </div>
                        <div className={styles.container_legend}>
                            <LegendBlock datasets={data.datasets}/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GraphWithLegend;