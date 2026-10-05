import React, { useState } from "react";
import styles from "./Metodkabinet.module.css"
import MyHat from "../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import miloserdova from "./miloserdova.png"

const Metodkabinet = () => {
    const [open, setOpen] = useState(false)
    
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ КАБИНЕТ МГСВ"/>
            </div>
            <div className={styles.flex_row}>
                <img className={styles.image} src={miloserdova} alt="" />
                <div className={styles.container_content}>
                    <h2>телефон – 8 (495) 699 – 42 – 62</h2>
                    <br />
                    <h3>Заведующая методическим  кабинетом МГСВ  -  Милосердова Галина Васильевна</h3>
                    <br />
                    <p>Образование – высшее. Московский государственный заочный педагогический институт, 1985 г.</p>
                    <br />
                    <p>Ветеран труда.</p>
                    <br />
                    <p>Заслуженный учитель школы Российской Федерации.</p>
                    <br />
                    <p>За многолетний плодотворный труд награждена орденом «Знак Почета», многими ведомственными и общественными наградами.</p>
                    <br />
                    <p>Методический кабинет – это центр, обладающий  необходимой информацией, учебно-методической литературой. Всё его содержание направлено на оказание помощи первичным, районным и окружным Советам ветеранов города  Москвы в духовно-нравственном и гражданско-патриотическом воспитании молодежи, повышение лекторского мастерства, создание единого информационного и методического пространства.</p>
                </div>
            </div>
            <div className={styles.about_cards}>
                <div className={styles.card}>Положение о методическом кабинете МГСВ</div>
                <div className={styles.card}>План работы МГСВ</div>
                <div
                    className={`${styles.card} ${styles.card_expandable} ${open ? styles.card_open : ""}`}
                >
                    <div
                        className={styles.card_header}
                        onClick={() => setOpen(!open)}
                    >
                        Направления деятельности
                        <span className={`${styles.arrow} ${open ? styles.arrow_open : ""}`}>
                            ▼
                        </span>
                    </div>

                    <div
                        className={`${styles.card_body} ${open ? styles.card_body_open : ""}`}
                    >
                        <p className={styles.card_subtitle}>
                            1. Методическое сопровождение:
                        </p>

                        <ul className={styles.card_list}>
                            <li>Социальная защита ветеранов и пенсионеров</li>
                            <li>Патриотическое воспитание молодежи</li>
                            <li>
                                <Link to="#">Организационно плановая работа</Link>
                            </li>
                            <li>Культурно плановая работа</li>
                            <li>Информационно аналитическая работа</li>
                        </ul>

                        <p className={styles.card_subtitle}>
                            2. Взаимодействие с лекторской группой МГСВ
                        </p>
                    </div>
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

export default Metodkabinet