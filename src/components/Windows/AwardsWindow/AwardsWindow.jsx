import React, { useState } from "react";
import styles from "./AwardsWindow.module.css";
import { awardsArray } from "./AwardsArray";
import AwardBlock from "./AwardBlock";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import AwardDocument from "./AwardDocument";

const AwardsWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    
    const handleShowAwardDocument = (path) => {
        setCurrentDocument(path);
    };

    const handleCloseAwardDocument = () => {
        setCurrentDocument(null);
    };

    return (
        <div className={styles.container}>
            {currentDocument ? (
                <AwardDocument path={currentDocument} onClose={handleCloseAwardDocument} />
            ) : (
                <>
                    <div className={styles.container_head}>            
                        <MyHat heading="Награды МГСВ"/>
                    </div>
                    <div className={styles.container_content}>
                        {awardsArray.map((award, index) => (
                            <AwardBlock 
                                key={index} 
                                award={award} 
                                onClick={() => handleShowAwardDocument(award.path)}
                            />
                        ))}
                    </div>
                    <div className={styles.container_bottom}>            
                        <BottomPanel/>
                    </div>
                </>
            )}
        </div>
    );
};

export default AwardsWindow;