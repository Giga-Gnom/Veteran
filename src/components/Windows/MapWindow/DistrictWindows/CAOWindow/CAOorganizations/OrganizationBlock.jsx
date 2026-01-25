import React from "react";
import styles from "./OrganizationBlock.module.css";

const OrganizationBlock = ({ name, address, phone, chairman }) => {
    return (
        <div className={styles.block}>
            <h3>Первичная организация №{name}</h3>
            <span><strong>Адрес:</strong><br /> {address}</span>
            <br />
            <h4>Председатель:</h4>
            <span>{chairman}</span >
            <span><strong>Телефон:</strong> {phone}</span>
            {/* <span><strong>Мобильный телефон:</strong> {chairman.mobile}</span> */}
        </div>
    );
}

export default OrganizationBlock;