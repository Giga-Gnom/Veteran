import React from "react";
import styles from "./SVAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import SVAOorgBlock from "./SVAOorgBlock";
import { SVAOArray } from "./SVAOArray";

const SVAOorganization = () => {
    const {areaID} = useParams();
    const districtData = SVAOArray.find(item => item.id.toString() === areaID)
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData?.name} />
            </div>
            <div className={styles.container_content}>
            {districtData ?
                (districtData.organizations.map((org, index) => (
                        <SVAOorgBlock 
                            key={index}
                            org={org}
                        />
                )))
                :
                (<div className={styles.noInfo}>Информация по данному району не найдена</div>)
            }
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/northeast">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default SVAOorganization;