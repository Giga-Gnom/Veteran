import React from "react";
import styles from "./InformationOtdelWindow.module.css"
import MyHat from "../../../../Hat/MyHat";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { Link } from "react-router-dom";
import { informationOtdelArray } from "./informationOtdelArray";
import InformationOtdelPerson from "./InformationOtdelPerson";

const InformationOtdelWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Отдел информации и спецпроектов"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_header}>
                    <h2>Отдел информации и спецпроектов</h2>
                    <h2>Самый молодой отдел МГСВ. Создан 1 января 2024 года.</h2>
                </div>
                <div className={styles.container_content_persons}>
                    {informationOtdelArray.map((person, index) => (
                        <InformationOtdelPerson key={index} person={person}/>
                    ))}
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

export default InformationOtdelWindow;