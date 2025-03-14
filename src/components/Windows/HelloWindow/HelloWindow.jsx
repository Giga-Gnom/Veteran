import React, { useRef, useState } from "react";
import styles from "./HelloWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import video from "../MainWindow/src_mainwindow/AIvideo1.mp4";

const HelloWindow = () =>{
      const [isPlaying, setIsPlaying] = useState(false);
      const videoRef=useRef(null);
    
      const handleVideoClick = () => {
        if(isPlaying){
          videoRef.current.pause();
        }
        else{
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="Приветствие"/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_video}>
                    <video
                    ref={videoRef}
                    className={styles.hellovideo}
                    loop
                    autoPlay = {isPlaying}
                    onClick={handleVideoClick}
                    muted={false}
                    ><source src={video} type="video/mp4"/></video>
                </div>
                <div className={styles.container_content_text}>
                    <h1 className={styles.container_content_text_h1}>Здравствуйте, друзья!</h1>
                    <p>Мы приветствуем вас в Московском городском совете ветеранов войны и труда. 
                    Сегодня мы - самая крупная общественная организация Москвы и самая многочисленная ветеранская организация страны. 
                    МГСВ может смело назвать себя флагманом ветеранского движения как в Москве, так и в России. 
                    На сегодняшний день только  актив городского совета насчитывает более 6 000 человек. 
                    В его составе - неравнодушные москвичи всех профессий и возрастов, те, для кого важна забота о ветеранах и сохранение Исторической Памяти о Великой войне.</p>
                    <p>Благодаря современным технологиям у вас есть возможность познакомиться с историей нашей организации, 
                    её структурой, направлениями работы и людьми, которые здесь трудятся.</p>
                    <p>Мы представляем вам необходимую информацию, которая может быть полезна как в ветеранской работе 
                    и в работе общественных организаций, так и простым москвичам.</p>
                    <p>Наш дружный коллектив желает вам интересных открытий и приглашает к сотрудничеству во благо ветеранов, 
                    во благо любимой столицы!
</p>
                </div>
            </div>
            <div className={styles.container_head}>            
            <BottomPanel/>
            </div>
        </div>
    )
}

export default HelloWindow;