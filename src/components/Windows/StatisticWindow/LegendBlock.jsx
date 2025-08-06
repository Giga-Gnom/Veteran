import React from "react";
import styles from "./LegendBlock.module.css";

const LegendBlock = ({datasets}) => {
    const regions = ["ЦАО", "САО", "СВАО", "ВАО", "ЮВАО", "ЮАО", "ЮЗАО", "ЗАО", "СЗАО", "ЗелАО", "ТинАО"];

    return(
        <div className={styles.container}>
            <div className={styles.container_region}>
                {regions.map((region, index) => (
                    <div key={index} className={styles.region_item}>
                        {region}
                    </div>
                ))}
            </div>
            {datasets.map((dataset, index) => (
                <div key={index} style={{color: dataset.backgroundColor}} className={styles.dataset_container}>
                    {<div className={styles.container_text}>
                        {/* {dataset.label} */}
                    </div>}
                    <div className={styles.container_stats}>
                        {dataset.data.map((data, index) => (
                            <div key={index} className={styles.container_stats_data}>
                                {data}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LegendBlock;