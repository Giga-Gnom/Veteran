import React, { useEffect, useState } from "react";
import styles from "./RegionalConnectionWindow.module.css";
import { regionsArray } from "./RegionsArray";
import Region from "./Region";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import RegionDocument from "./RegionDocumebt";
import regionsService from "../../../services/regionsService";

const RegionalConnectionWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    const [regions, setRegions] = useState([])

    useEffect(() => {
        loadRegions()
    }, [])

    const loadRegions = async () => {
        try {
            const regionsData = await regionsService.getAllRegions()
            setRegions(regionsData)
        } catch (error) {
            console.error("error loading regions: ", error)
        }
    }

    const handleShowDocument = (path) => {
        if(path!="#"){
            setCurrentDocument(path);
        }
    };

    const handleCloseDocument = () => {
        setCurrentDocument(null);
    };

    return (
        <div className={styles.container}>
            {currentDocument ? (
                    <RegionDocument path={currentDocument} onClose={handleCloseDocument} />
                ) : (
                    <>
                        <div className={styles.container_head}>
                            <MyHat heading="Региональные связи" />
                        </div>
                        <div className={styles.container_content}>
                                {regions.map((region, index) => (
                                    <Region 
                                    key={index} 
                                    region={region} 
                                    onShowDocument={handleShowDocument} />
                                ))}
                        </div>
                        <div className={styles.container_bottom}>
                            <BottomPanel />
                        </div>
                    </>
                )}
            </div>
    );
};

export default RegionalConnectionWindow;