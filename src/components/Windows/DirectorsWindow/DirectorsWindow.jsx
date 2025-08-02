import React, { useState } from "react";
import styles from "./DirectorsWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import Director from "./Director";
import { personsArray } from "./PersonsArray";
import PashkovBlock from "./PashkovBlock";

const DirectorsWindow = () => {



    return(
        <div className={styles.container}>
        <div className={styles.container_head}>            
            <MyHat heading="РУКОВОДСТВО МГСВ"/>
        </div>
        <div className={styles.container_content}>
            <div className={styles.horizontal_el_container}>
                <PashkovBlock person={personsArray[0]} key={0}></PashkovBlock>
            </div>
            <div className={styles.vertical_el_container}>
                {personsArray.slice(1).map((person, index) =>  <Director className={styles.vertical} key={index} person={person}/>)}
            </div>
            <br /><br /><br />
        </div>
        <div className={styles.container_bottom}>            
            <BottomPanel/>
        </div>
    </div>
    )
}

export default DirectorsWindow;