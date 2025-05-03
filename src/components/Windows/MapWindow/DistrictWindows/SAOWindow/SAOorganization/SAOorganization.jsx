import React from "react";
import styles from "./SAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import { SAOArray } from "./SAOArray";
import SAOorgBlock from "./SAOorgBlock";

const SAOorganizations = () => {
    const {areaID} = useParams();
    const districtData = SAOArray.find(item => item.id.toString() === areaID)
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData.name} />
            </div>
            <div className={styles.container_content}>
            {districtData.organizations.map((org, index) => (
                    <SAOorgBlock
                        key={index}
                        org={org}
                    />
                ))}
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/north">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default SAOorganizations;