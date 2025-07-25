import React, { useState } from "react";
import styles from "./DirectorsWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import Director from "./Director";
import { personsArray } from "./PersonsArray";

const DirectorsWindow = () => {



    return(
        <div className={styles.container}>
        <div className={styles.container_head}>            
            <MyHat heading="РУКОВОДСТВО"/>
        </div>
        <div className={styles.container_content}>
                {personsArray.map((person, index) =>  <Director key={index} person={person}/>)}
        </div>
        <div className={styles.container_head}>            
            <BottomPanel/>
        </div>
    </div>
    )
}

export default DirectorsWindow;