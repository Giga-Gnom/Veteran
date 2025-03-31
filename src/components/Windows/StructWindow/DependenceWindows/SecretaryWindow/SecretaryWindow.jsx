import React from "react";
import styles from "./SecretaryWindow.module.css"
import MyHat from "../../../../Hat/MyHat";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { Link } from "react-router-dom";

const SecretaryWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Секретариат"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_header}>
                    <h2>ПРИЕМНАЯ РУКОВОДИТЕЛЯ МГСВ</h2>
                    <div className={styles.container_content_header_text}>
                        <p>Ведение приема посетителей</p>
                        <p>Прием звонков</p>
                        <p>Организация встречи руководителя с ветеранами, руководителями других общественных организаций, представителями и руководителями государственных органов власти</p>
                        <p>Ведение делопроизводства: книги учета входящей документации, книги учета исходящей документации, прием документов на подпись руководителю, распределение документов от руководителя по отделам</p>
                        <p>Работа с электронной почтой: прием и отправка документов</p>
                        <p>Сканирование и ксерокопирование документов</p>
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

export default SecretaryWindow;