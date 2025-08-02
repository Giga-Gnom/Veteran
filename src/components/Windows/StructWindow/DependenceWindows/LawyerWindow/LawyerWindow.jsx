import React from "react";
import styles from "./LawyerWindow.module.css";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import MyHat from "../../../../Hat/MyHat";
import personI from "./srcLawyer/lawyer.jpg";

const LawyerWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="ЮРИДИЧЕСКИЙ ОТДЕЛ"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_person}>
                    <img src={personI} alt="" style={{margin:"0 2vw"}} className={styles.container_content_person_image}/>
                    <div className={styles.container_content_pesron_text}>
                        <p>Юрисконсульт Московского городского Совета ветеранов </p>
                        <h2>Гопанюк Ольга Владимировна</h2>
                        <div className={styles.container_content_pesron_text_more}>
                            <p>Главной задачей юрисконсульта является обеспечение высокой правовой защищенности деятельности Московской городской организации ветеранов и ее членов.</p>
                            <p>Юрисконсульт осуществляет анализ законодательства и судебной практики; предоставляет правовые консультации; проводит юридическую экспертизу официальных документов; ведет договорную деятельность общественной организации, осуществляет правовое взаимодействие с органами исполнительной власти, ведет работу по подготовке пакетов документов для осуществления юридически значимых действий.</p>
                            <p>Пенсионеры и ветераны Москвы могут обратиться в Московский городской Совет ветеранов по любому юридическому вопросу и получить профессиональную первичную консультацию юриста.</p>
                            <p>За год за правовой поддержкой и юридическими консультациями в МГСВ обращается более 300 человек. </p>
                            <p>В газете «Московский ветеран» публикуются статься с правовыми разъяснениями вопросов, которые являются наиболее насущными для пенсионеров и ветеранов города Москвы.</p>
                        </div>
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

export default LawyerWindow;