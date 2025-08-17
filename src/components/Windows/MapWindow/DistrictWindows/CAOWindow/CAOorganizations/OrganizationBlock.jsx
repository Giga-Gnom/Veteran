import React from "react";
import styles from "./OrganizationBlock.module.css";

const OrganizationBlock = ({ name, address, reception, chairman }) => {
    return (
        <div className={styles.block}>
            <h3>{name}</h3>
            <span><strong>Адрес:</strong> {address}</span>
            <br />
            <span><strong>Прием:</strong> {reception}</span>
            <h4>Председатель:</h4>
            <span>{chairman.name}</span >
            <span><strong>Телефон:</strong> {chairman.phone}</span>
            {/* <span><strong>Мобильный телефон:</strong> {chairman.mobile}</span> */}
        </div>
    );
}

export default OrganizationBlock;