import React, { useEffect, useState } from "react";
import styles from "./UZAOorganization.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link, useParams } from "react-router-dom";
import UZAOorgBlock from "./UZAOorgBlock";
import { UZAOorgArray } from "./UZAOorgArray";
import mapService from "../../../../../../services/mapService";

const UZAOorganization = () => {
    const {areaID} = useParams();
    const districtData = UZAOorgArray.find(item => item.id.toString() === areaID)
        const [organizations, setOrganizatios] = useState([]) 
        const [mainOrganization, setMainOrganization] = useState(null)
        const [sortOrganizations, setSortOrganizations] = useState([])
    
        useEffect(() => {
            loadOrganizationsForCAO(areaID)
        }, [areaID])
    
        const loadOrganizationsForCAO = async (areaId) => {
            try {
                const organizationsData = await mapService.getAllOrganizationsFromArea('Юго-западный', areaId)
                console.log(organizations)
                setMainOrganization(organizationsData.find(org => org.is_head === 1  || org.is_head === true))
                setSortOrganizations(organizationsData.filter(org => org.is_head === 0 || org.is_head === false).sort((a, b) => a.head_text - b.head_text))
                setOrganizatios(organizationsData)
            } catch {
                console.error("error load organizations data: ", error)
            }
        }

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={districtData?.name} />
            </div>
            <div className={styles.container_content}>
                {mainOrganization && (
                    <div style={{width: "100vw", justifyContent: "center", display: "flex", textAlign: "center"}}>
                        <div className={styles.container_content_SV}>
                            <h3>Совет ветеранов района {mainOrganization.head_text}</h3>
                            <span><strong>Адрес:</strong><br /> {mainOrganization.address}</span>
                            <h4>Председатель:</h4>
                            <span>{mainOrganization.director}</span >
                            <span><strong>Телефон:</strong>{mainOrganization.phone}</span>
                        </div>
                    </div>
                )}
            {districtData ?
                (sortOrganizations.map((org, index) => (
                        <UZAOorgBlock
                            key={index}
                            org={org}
                        />
                )))
                :
                (<div className={styles.noInfo}>Информация по данному району не найдена</div>)
            }
            </div>
            <div className={styles.container_footer}>
                <Link to="/district/southwest">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default UZAOorganization;