import React from "react";
import styles from "./MGSVWindow.module.css";
import { mgsvArray } from "./mgsvArray";
import MgsvBlock from "./mgsvblock";
import MyHat from "../../../../Hat/MyHat";
import BottomPanel from "../../../../BottomPanel/BottomPanel";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { Link } from "react-router-dom";

const MGSVWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МГСВ"/>
            </div>
            <div className={styles.container_content}>
                {mgsvArray.map((person, index) => <MgsvBlock key={index} person={person}/>)}
            </div>
            <div className={styles.container_button}>
                <Link to="/struct">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default MGSVWindow;