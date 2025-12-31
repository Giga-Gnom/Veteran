import React, { useEffect, useState } from "react";
import styles from "./AwardsWindow.module.css";
import { awardsArray } from "./AwardsArray";
import AwardBlock from "./AwardBlock";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import AwardDocument from "./AwardDocument";
import awardsService from "../../../services/awardsService";

const AwardsWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    const [awards, setAwards] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadingAwards()
    }, [])

    const loadingAwards = async () => {
        try{
            setLoading(true)
            const awardsData = await awardsService.getAllAwards()
            setAwards(awardsData)
        } catch (error) {
            console.log("error fetching awards: ", error)
        } finally {
            setLoading(false)
        }
    }
    
    const handleShowAwardDocument = (award) => {
        setCurrentDocument(award.file_path);
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
                        {awards.map((award, index) => (
                            <AwardBlock 
                                key={index} 
                                award={award} 
                                onClick={() => handleShowAwardDocument(award)}
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