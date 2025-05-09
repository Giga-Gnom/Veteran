import React from "react";
import styles from "./UVAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import UVAOorgBlock from "./UVAOorgBlock";
import { UVAOorgArray } from "./UVAOorgArray";

const UVAOorganization = () => {
    const {areaID} = useParams();
    const districtData = UVAOorgArray.find(item => item.id.toString() === areaID)
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData?.name} />
            </div>
            <div className={styles.container_content}>
            {districtData ?
                (districtData.organizations.map((org, index) => (
                        <UVAOorgBlock 
                            key={index}
                            org={org}
                        />
                )))
                :
                (<div className={styles.noInfo}>Информация по данному району не найдена</div>)
            }
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/southeast">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default UVAOorganization;