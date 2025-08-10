import React, { useState } from "react";
import styles from "./StandartDocumentsWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { standartsArray } from "./stabdartsArray";
import StandartDocumentBlock from "./StandartDocumentBlock";
import StandartDoc from "./StandartDoc";

const StandartDocumentsWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);

    const handleShowDocument = (path) => {
        setCurrentDocument(path);
    };

    const handleCloseDocument = () => {
        setCurrentDocument(null)
    }

    return(
        <div className={styles.container}>
            {currentDocument ?
            (<StandartDoc path={currentDocument} onClose={handleCloseDocument}/>)
            :
            (
                <>
                    <div className={styles.container_head}>            
                        <MyHat heading="Нормативные Документы"/>
                    </div>
                    <div className={styles.container_content}>
                        {standartsArray.map((standart, index)=>(
                            <StandartDocumentBlock 
                            key={index} 
                            standart={standart} 
                            onClick={()=>handleShowDocument(standart.path)}/>))}
                    </div>
                    <div className={styles.container_head}>            
                        <BottomPanel/>
                    </div>
                </>
            )}
        </div>
    )
}

export default StandartDocumentsWindow;