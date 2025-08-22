import React from "react";
import styles from "./OrganizationWindow.module.css"
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import MyHat from "../../../../Hat/MyHat";
import { Link } from "react-router-dom";
import neshina from "./srcOrganization/image.png"
import zinakova from "./srcOrganization/фото Зинакова С.Г..jpg"

const OrganizationWindow = () => {
    return(
        <div className={styles.container}>
        <div className={styles.container_head}>
            <MyHat heading="ОРГАНИЗАЦИОННЫЙ ОТДЕЛ"/>
        </div>
        <div className={styles.container_content}>
            <div className={styles.container_content_person}>
                <img src={neshina} alt="" style={{margin:"0 2vw"}} className={styles.container_content_person_image}/>
                <div className={styles.container_content_pesron_text}>
                    <p>Заведующая отделом</p>
                    <h2>НЕШИНА ТАТЬЯНА ДМИТРИЕВНА</h2>
                    <p>8-495-699-16-88</p>
                    <p>Ветеран труда, 45 лет трудового стажа, в т.ч., 37 лет государственной службы: Министерство обороны РФ, Комитет общественных связей города Москвы.</p>
                    <p>В Московском городском Совете ветеранов с 2016 года. Член Бюро, Президиума, Московского городского Совета ветеранов. </p>
                    <p>Награждена ведомственными наградами и Почетной грамотой Правительства Москвы</p>
                </div>
            </div>
            <div className={styles.container_content_person}>
                <div className={styles.container_content_pesron_text}>
                    <p>Главный специалист</p>
                    <h2>СЕРДЮК ВЛАДИМИР ФИЛИППОВИЧ</h2>
                    <p>8-495-699-76-82</p>
                    <p>Ветеран военной службы, ветеран труда.</p>
                    <p>32 года службы в Вооруженных Силах, работа в органах исполнительной власти города Москвы. В ветеранском движении с 2005 г.</p>
                    <p>Медали «За боевые заслуги», «За укрепление боевого содружества», Благодарность Верховного главнокомандующего Вооруженными Силами Российской Федерации, ведомственные и юбилейные награды</p>
                </div>
            </div>
            <div className={styles.container_content_person}>
                <img src={zinakova} alt="" style={{margin:"0 2vw"}} className={styles.container_content_person_image}/>
                <div className={styles.container_content_pesron_text}>
                    <p>Главный специалист</p>
                    <h2>ЗИНАКОВА СВЕТЛАНА ГРИГОРЬЕВНА</h2>
                    <p>8-495-699-20-54</p>
                    <p>Образование: высшее, Московский государственный педагогический институт им. В.И. Ленина; 44 года трудового стажа: от учителя начальных классов до директора школы.</p>
                    <p>Почетный работник образования и науки.</p>
                    <p>Награждена ведомственными и юбилейными наградами.</p>
                </div>
            </div>
            <br /><br /><br /><br />
        </div>
        <div className={styles.container_button}>
            <Link to="/struct">
                <BeforePageButton/>
            </Link>
        </div>
    </div>
    )
}

export default OrganizationWindow;