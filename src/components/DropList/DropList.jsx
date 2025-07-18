import React from "react";
import styles from "./DropList.module.css";
import { Link } from "react-router-dom";

const DropList = () => {
    return(
        <div className={styles.dropListContainer}>
            <div className={styles.block_link}>
                <Link className={styles.dropListContainer_link} to="/">Главная</Link>
            </div>
            <div className={styles.block_link}>
                <Link className={styles.dropListContainer_link} to="/hello">Приветствие руководителя</Link>
            </div>
            <Link className={styles.dropListContainer_link} to="/createhistory">История создания</Link>
            <Link className={styles.dropListContainer_link} to="/placehistory">История места</Link>
            <Link className={styles.dropListContainer_link} to="/directors">Руководство</Link>
            <Link className={styles.dropListContainer_link} to="/struct">Структура МГСВ</Link>
            <Link className={styles.dropListContainer_link} to="/map">Интерактивная карта москвы</Link>
            <Link className={styles.dropListContainer_link} to="/statistic">Статистика</Link>
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