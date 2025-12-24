import React, { useEffect, useState } from "react";
import styles from "./StandartDocumentsWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { standartsArray } from "./stabdartsArray";
import StandartDocumentBlock from "./StandartDocumentBlock";
import StandartDoc from "./StandartDoc";
import standartDocumentService from "../../../services/standartDocumentService"


const StandartDocumentsWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadingDocuments()
    }, [])

    const loadingDocuments = async () => {
        try {
            setLoading(true)
            const docs = await standartDocumentService.getAllDocuments()
            setDocuments(docs)
        } catch (error) {
            console.log("Error loading documents in main prog: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleShowDocument = (path) => {
        setCurrentDocument(path);
        console.log("dont open doc")
    };

    const handleCloseDocument = () => {
        setCurrentDocument(null)
    }

    return(
        <div className={styles.container}>
            {currentDocument ?
            (<StandartDoc path={currentDocument.file_path} onClose={handleCloseDocument}/>)
            :
            (
                <>
                    <div className={styles.container_head}>            
                        <MyHat heading="Нормативно-правовая база"/>
                    </div>
                    <div className={styles.container_content}>
                        {documents.map((standart, index)=>(
                            <StandartDocumentBlock 
                            key={index} 
                            path={standart.path}
                            title={standart.title} 
                            onClick={()=>handleShowDocument(standart)}/>))}
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