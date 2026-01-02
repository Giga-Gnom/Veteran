import React from "react";
import styles from "./Region.module.css";

const Region = ({ region, onShowDocument }) => {
    return (
        <div className={styles.container}>
            <img className={styles.image} src={region.logo_path} alt="" />
            <button className={styles.button} onClick={() => onShowDocument(region.document_path)}>{region.region_name}</button>
        </div>
    );
};

export default Region;