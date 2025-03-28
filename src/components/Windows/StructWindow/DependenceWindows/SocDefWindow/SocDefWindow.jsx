import React from "react";
import styles from "./SocDefWindow.module.css";
import MyHat from "../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import babich from "./srcSocDef/Babich.jpg"
import mitina from "./srcSocDef/Лена.jpg"

const SocDefWindow = () => {
    return(
        <div className={styles.container}>
        <div className={styles.container_head}>
            <MyHat heading="Отдел социальной защиты"/>
        </div>
        <div className={styles.container_content}>
            <div className={styles.container_content_header}>
                <h2 style={{marginBottom:"7vh"}}>Отдел социальной защиты МГСВ</h2>
            </div>
            <div className={styles.container_content_person}>
                <img src={babich} alt="" style={{margin:"0 2vw"}} className={styles.container_content_person_image}/>
                <div className={styles.container_content_pesron_text}>
                    <p>Заведующий отделом</p>
                    <h2>БАБИЧ Олег Семёнович</h2>
                    <p>8 (495) 699-27-51</p>
                    <p>Отдел социальной защиты возглавляет с 2002 года. Член Президиума МГСВ. Ветеран боевых действий. Полковник в отставке. Награжден многими государственными наградами.</p>
                </div>
            </div>
            <div className={styles.container_content_person}>
                <div className={styles.container_content_pesron_text}>
                    <p>Заместитель заведующей отделом</p>
                    <h2>КЛЕПИКОВ Александр Николаевич</h2>
                    <p>8 (495) 699-26-04</p>
                    <p>В МГСВ с 2022 года. Окончил ВПА им. В.И. Ленина.  Полковник в отставке. Заслуженный работник культуры РФ. Награжден орденом Почета. </p>
                </div>
            </div>
            <div className={styles.container_content_person}>
                <img src={mitina} alt="" className={styles.container_content_person_image}/>
                <div className={styles.container_content_pesron_text}>
                    <p>Главный специалист</p>
                    <h2>МИТИНА Елена Викторовна</h2>
                    <p>8 (495) 699-26-66</p>
                    <p>Окончила МИСиС, МПСИ, МФЮА. Работала в ГБУ ТЦСО  «Сокольники»,  Благотворительном фонде «Абсолют-Помощь», Московском Доме ветеранов (пенсионеров) войн и Вооруженных Сил.</p>
                </div>
            </div>
            <div className={styles.container_content_zadachi}>
                <h2> Основные задачи отдела: </h2>
                <p>-    cодействие защите прав, интересов ветеранов и пенсионеров, обеспечение условий их достойного положения в обществе; </p>
                <p>-	содействие защите социально-экономических, трудовых, жилищных, имущественных, личных и других прав старшего поколения, улучшению их материального благосостояния, жилищных условий, бытового, медицинского, физкультурно-оздоровительного и других видов обслуживания в рамках существующих законов Российской Федерации;</p>
                <p>-	обеспечение исполнения законодательства Российской Федерации и города Москвы, регулирующего вопросы социальной защиты пенсионеров и ветеранов;</p>
                <p>-    взаимодействие с органами местного самоуправления, федеральными и городскими органами государственной власти по вопросам, входящим в  компетенцию отдела;</p>
                <p>-    осуществление иных полномочий, направленных на улучшение работы по вопросам социальной защиты пенсионеров и ветеранов.</p>
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

export default SocDefWindow;