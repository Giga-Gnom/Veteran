import React from "react";
import styles from "./PrezidiumWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import BottomPanel from "../../../../BottomPanel/BottomPanel";
import { prezidiumArray } from "./prezidiumArray";
import PrezidiumBlock from "./PrezidiumBlock";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";

const PrezidiumWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="ПРЕЗИДИУМ"/>
            </div>
            <div className={styles.container_content}>
                {prezidiumArray.map((person, index) => <PrezidiumBlock key={index} person={person}/>)}
                <br /><br /><br /><br />
            </div>
            <div className={styles.container_button}>
                <Link to="/struct">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default PrezidiumWindow;