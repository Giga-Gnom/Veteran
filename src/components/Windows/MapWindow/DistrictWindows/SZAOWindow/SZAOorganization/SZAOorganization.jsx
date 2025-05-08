import React from "react";
import styles from "./SZAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import SZAOorgBlock from "./SZAOorgBlock";
import { SZAOorgArray } from "./SZAOorgArray";

const SZAOorganization = () => {
    const {areaID} = useParams();
    const districtData = SZAOorgArray.find(item => item.id.toString() === areaID)
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData?.district} />
            </div>
            <div className={styles.container_content}>
            {districtData ?
                (districtData.organizations.map((org, index) => (
                        <SZAOorgBlock 
                            key={index}
                            org={org}
                        />
                )))
                :
                (<div className={styles.noInfo}>Информация по данному району не найдена</div>)
            }
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/northwest">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default SZAOorganization;