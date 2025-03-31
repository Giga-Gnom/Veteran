import React from "react";
import styles from "./BuhgalteriaWindow.module.css"
import MyHat from "../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { buhgalteriaArray } from "./buhgalteriaArray";
import BuhgalteriaPerson from "./BuhgalteriaPerson";

const BuhgalteriaWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Отдел бухгалтерии"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_header}>
                    <h2>Сотрудники бухгалтерии МГСВ</h2>
                </div>
                <div className={styles.container_content_persons}>
                    {buhgalteriaArray.map((person, index) => <BuhgalteriaPerson key={index} person={person}/>)}
                </div>
            </div>
            <div className={styles.container_button}>
            <Link to="/struct">
                <BeforePageButton/>
            </Link>
        </div>
    </div>
    )
}

export default BuhgalteriaWindow;