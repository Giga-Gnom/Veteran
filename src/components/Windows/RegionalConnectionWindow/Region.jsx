import React from "react";
import styles from "./Region.module.css";

const Region = ({ region, onShowDocument }) => {
    return (
        <div className={styles.container}>
            <img className={styles.image} src={region.image} alt="" />
            <button className={styles.button} onClick={() => onShowDocument(region.path)}>{region.name}</button>
        </div>
    );
};

export default Region;