import React from "react";
import styles from "./DropList.module.css";
import { Link } from "react-router-dom";

const DropList = () => {
    return(
        <div className={styles.dropListContainer}>
            <Link className={styles.dropListContainer_link} to="/">Главная</Link>
            <Link className={styles.dropListContainer_link} to="/hello">Приветствие руководителя</Link>
            <Link className={styles.dropListContainer_link} to="/createhistory">История создания</Link>
            <Link className={styles.dropListContainer_link} to="/placehistory">История места</Link>
            <Link className={styles.dropListContainer_link} to="/directors">Руководство</Link>
            <Link className={styles.dropListContainer_link} to="/">Структура МГСВ</Link>
            <Link className={styles.dropListContainer_link} to="/">Интерактивная карта москвы</Link>
            <Link className={styles.dropListContainer_link} to="/">Статистика</Link>
            <Link className={styles.dropListContainer_link} to="/regions">Региональные связи</Link>
            <Link className={styles.dropListContainer_link} to="/events">Наши мероприятия</Link>
            <Link className={styles.dropListContainer_link} to="/awards">Награды МГСВ</Link>
            <Link className={styles.dropListContainer_link} to="/partners">Наши коллеги, партнёры, соратники</Link>
            <Link className={styles.dropListContainer_link} to="/newspapers">Газета "Московский ветеран"</Link>
            <Link className={styles.dropListContainer_link} to="/standarts">Нормативные документы</Link>
        </div>

    )
}

export default DropList;