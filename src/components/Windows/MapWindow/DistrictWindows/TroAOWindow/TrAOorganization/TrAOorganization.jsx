import React from "react";
import styles from "./TrAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import TrAOorgBlock from "./TrAOorgBlock";
import { TrAOorgArray } from "./TrAOorgArray";

const TrAOorganization = () => {
    const {areaID} = useParams();
    const districtData = TrAOorgArray.find(item => item.id.toString() === areaID)

    if (!districtData || !districtData.organizations || districtData.organizations.length === 0) {
    return (
        <div>
            <div className={styles.noInfo}>Информация по данному району не найдена</div>
            <div style={{position: "fixed", bottom: "2vh"}}>
                <Link to="/district/troitskiy">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
  }

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData.name} />
            </div>
            <div className={styles.container_content}>
                <div style={{width: "100vw", justifyContent: "center", display: "flex"}}>
                    <div className={styles.block}>
                        <h3>{districtData.organizations[0].name}</h3>
                        <span><strong>Адрес:</strong> {districtData.organizations[0].address}</span>
                        <br />
                        <span><strong>Прием:</strong> {districtData.organizations[0].reception}</span>
                        <h4>Председатель:</h4>
                        <span>{districtData.organizations[0].chairman.name}</span >
                        <span><strong>Телефон:</strong> {districtData.organizations[0].chairman.phone}</span>
                    </div>
                </div>
            {districtData.organizations.slice(1).map((org, index) => (
                <TrAOorgBlock org={org} key={index}/>
                ))}
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/troitskiy">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default TrAOorganization;