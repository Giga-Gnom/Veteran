import React from "react";
import styles from "./Metodkabinet.module.css"
import MyHat from "../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";

const Metodkabinet = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ КАБИНЕТ МГСВ"/>
            </div>
            <div className={styles.container_content}>
                <h2>телефон – 8 (495) 699 – 42 – 62</h2>
                <h3>Заведующая методическим кабинетом – Милосердова Галина Васильевна</h3>
                <p>Методический кабинет – это центр, обладающий  необходимой информацией, учебно-методической литературой. Всё его содержание направлено на оказание помощи первичным, районным и окружным Советам ветеранов города  Москвы в духовно-нравственном и гражданско-патриотическом воспитании молодежи, повышение лекторского мастерства, создание единого информационного и методического пространства.</p>
            </div>
            <div className={styles.container_button}>
                <Link to="/struct">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default Metodkabinet