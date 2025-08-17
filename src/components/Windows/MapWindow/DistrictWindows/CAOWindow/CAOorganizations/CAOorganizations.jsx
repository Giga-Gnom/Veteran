import React from "react";
import styles from "./CAOorganizations.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import { CAOArray } from "./CAOArray";
import OrganizationBlock from "./OrganizationBlock";

const CAOorganizations = () => {
    const {areaID} = useParams();
    const districtData = CAOArray.find(item => item.id.toString() === areaID)
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData.name} />
            </div>
            <div className={styles.container_content}>
                <div style={{width: "100vw", justifyContent: "center", display: "flex"}}>
                    <div className={styles.container_content_SV}>
                        <h3>{districtData.organizations[0].name}</h3>
                        <span><strong>Адрес:</strong> {districtData.organizations[0].address}</span>
                        <br />
                        <span><strong>Прием:</strong> {districtData.organizations[0].reception}</span>
                        <h4>Председатель:</h4>
                        <span>{districtData.organizations[0].chairman.name}</span >
                        <span><strong>Телефон:</strong> {districtData.organizations[0].chairman.phone}</span>
                        {/* <span><strong>Мобильный телефон:</strong> {districtData.organizations[0].chairman.mobile}</span> */}
                    </div>
                </div>
            {districtData.organizations.slice(1).map((org, index) => (
                    <OrganizationBlock 
                        key={index}
                        name={org.name}
                        address={org.address}
                        reception={org.reception}
                        chairman={org.chairman}
                    />
                ))}
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/central">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default CAOorganizations;