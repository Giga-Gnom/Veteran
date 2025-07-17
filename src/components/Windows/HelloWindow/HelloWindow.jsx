import React, { useRef, useState } from "react";
import styles from "./HelloWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import image from "../DirectorsWindow/srcDirectors/Pashkov.jpg"
import { handleImgClick } from "../../../app/utils";

const HelloWindow = () =>{
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="ПРИВЕТСТВИЕ РУКОВОДИТЕЛЯ"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_img}>
                    <img src={image} alt="" className={styles.container_content_image} onClick={handleImgClick}/>
                    <p>Приветствие председателя МГСВ Пашкова Георгия Ивановича</p>
                </div>
                <div className={styles.container_content_text}>
                    <h1 className={styles.container_content_text_h1}>Здравствуйте, друзья!</h1>
                    <p>Мы приветствуем вас в Московском городском совете ветеранов войны и труда. 
                        Сегодня мы - самая крупная общественная организация Москвы и самая многочисленная ветеранская 
                        организация страны. МГСВ может смело назвать себя флагманом ветеранского движения как в Москве,
                         так и в России. На сегодняшний день актив городского совета насчитывает более 6 000 человек. 
                         В его составе - неравнодушные москвичи всех профессий и возрастов, те, для кого важна забота 
                         о ветеранах и сохранение Исторической Памяти о Великой войне для будущих поколений.</p>
                    <p>Благодаря современным технологиям у вас есть возможность познакомиться с историей нашей организации, 
                        её структурой, направлениями работы и людьми, которые здесь трудятся.</p>
                    <p>Мы представляем вам необходимую информацию, которая может быть полезна как в ветеранской 
                        работе и в работе общественных организаций, так и простым москвичам.</p>
                    <p>Наш дружный коллектив желает вам интересных открытий и приглашает к сотрудничеству 
                        во благо ветеранов, во благо любимой столицы!</p>
                </div>
            </div>
            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
    )
}

export default HelloWindow;