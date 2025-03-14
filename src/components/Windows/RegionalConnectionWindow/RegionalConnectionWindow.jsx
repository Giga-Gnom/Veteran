import React, { useState } from "react";
import styles from "./RegionalConnectionWindow.module.css";
import { regionsArray } from "./RegionsArray";
import Region from "./Region";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import RegionDocument from "./RegionDocumebt";

const RegionalConnectionWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);

    const handleShowDocument = (path) => {
        setCurrentDocument(path);
    };

    const handleCloseDocument = () => {
        setCurrentDocument(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Региональные связи" />
            </div>
            <div className={styles.container_content}>
                {currentDocument ? (
                    <RegionDocument path={currentDocument} onClose={handleCloseDocument} />
                ) : (
                    regionsArray.map((region, index) => (
                        <Region key={index} region={region} onShowDocument={handleShowDocument} />
                    ))
                )}
            </div>
            <div className={styles.container_head}>
                <BottomPanel />
            </div>
        </div>
    );
};

export default RegionalConnectionWindow;