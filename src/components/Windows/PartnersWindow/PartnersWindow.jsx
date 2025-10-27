import React, { useState } from "react";
import styles from "./PartnersWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { partnersArray } from "./PartnersArray";
import PartnerBlock from "./PartnerBlock";
import PartnerWebview from "./PartnersWebview";

const PartnersWindow = () => {

    const [currentPartner, setCurrentPartner] = useState(null)

    function handleOpenPartenrResourse(path){
        setCurrentPartner(path)
    }

    function handleBackFromPartner(){
        setCurrentPartner(null)
    }

    if (currentPartner) {
        return (<PartnerWebview url={currentPartner} onBack={handleBackFromPartner}></PartnerWebview>)
    }


    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Наши Коллеги, Партнёры, Соратники"/>
            </div>
            <div className={styles.container_content}>
                {partnersArray.map((partner, index) => (<PartnerBlock key={index} partner={partner} onClick={()=>handleOpenPartenrResourse(partner.path)}/>))}
            </div>
            <div className={styles.container_bottom}>            
                <BottomPanel/>
            </div>
        </div>
    )
}

export default PartnersWindow;