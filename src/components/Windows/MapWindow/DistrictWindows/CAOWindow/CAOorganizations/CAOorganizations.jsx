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
            {districtData.organizations.map((org, index) => (
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