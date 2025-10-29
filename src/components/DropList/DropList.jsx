import React from "react";
import styles from "./DropList.module.css";
import { Link, useLocation } from "react-router-dom";

const DropList = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
    }
    return(
        <div className={styles.dropListContainer}>
            <div className={styles.block_link}>
                <Link className={`${styles.dropListContainer_link} ${isActive("/") ? styles.active : ""}`} to="/">Главная</Link>
            </div>
            <div className={styles.block_link}>
                <Link className={`${styles.dropListContainer_link} ${isActive("/hello") ? styles.active : ""}`} to="/hello">Приветствие руководителя</Link>
            </div>
            <Link className={`${styles.dropListContainer_link} ${isActive("/createhistory") ? styles.active : ""}`} to="/createhistory">История создания</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/placehistory") ? styles.active : ""}`} to="/placehistory">История места</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/directors") ? styles.active : ""}`} to="/directors">Руководство</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/struct") ? styles.active : ""}`} to="/struct">Структура МГОВ</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/map") ? styles.active : ""}`} to="/map">Интерактивная карта москвы</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/statistic") ? styles.active : ""}`} to="/statistic">Статистика</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/regions") ? styles.active : ""}`} to="/regions">Региональные связи</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/events") ? styles.active : ""}`} to="/events">Наши мероприятия</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/awards") ? styles.active : ""}`} to="/awards">Награды МГОВ</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/partners") ? styles.active : ""}`} to="/partners">Наши коллеги, партнёры, соратники</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/newspapers") ? styles.active : ""}`} to="/newspapers">Газета "Московский ветеран"</Link>
            <Link className={`${styles.dropListContainer_link} ${isActive("/standarts") ? styles.active : ""}`} to="/standarts">Нормативные документы</Link>
        </div>

    )
}

export default DropList;