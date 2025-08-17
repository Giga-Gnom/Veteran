import React from "react";
import styles from "./ZAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import ZAOorgBlock from "./ZAOorgBlock";
import { ZAOorgArray } from "./ZAOorgArray";

const ZAOorganization = () => {
    const {areaID} = useParams();
    const districtData = ZAOorgArray.find(item => item.id.toString() === areaID)
    if (!districtData || !districtData.organizations || districtData.organizations.length === 0) {
    return <div className={styles.noInfo}>Информация по данному району не найдена</div>;
  }
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData?.name} />
            </div>
            <div className={styles.container_content}>
                <div style={{width: "100vw", justifyContent: "center", display: "flex"}}>
                    <div className={styles.block}>
                        <h3>{districtData.organizations[0].name}</h3>
                        <span><strong>Адрес:</strong> {districtData.organizations[0].address}</span>
                        <br />
                        <h4>Председатель:</h4>
                        <span>{districtData.organizations[0].chairman.name}</span > 
                        <span><strong>Телефон:</strong> {districtData.organizations[0].chairman.phone}</span>
                    </div>
                </div>
            {districtData ?
                (districtData.organizations.slice(1).map((org, index) => (
                        <ZAOorgBlock 
                            key={index}
                            org={org}
                        />
                )))
                :
                (<div className={styles.noInfo}>Информация по данному району не найдена</div>)
            }
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/west">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default ZAOorganization;