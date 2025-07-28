import React from "react";
import styles from "./ConcrectDirector.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import misc from "./srcDirectors/Мисковец2_3.jpeg";
import { Link } from "react-router-dom";
import BeforePageButton from "../../UI/MyButtons/BeforePageButton";
import { handleImgClick } from "../../../app/utils";


const Miscovec = () =>{
    return(
<div className={styles.container}>
        <div className={styles.container_head}>            
            <MyHat heading="Мисковец Виктор Степанович"/>
        </div>
        <div className={styles.container_content}>
            <img className={styles.container_content_image} src={misc} alt="" onClick={handleImgClick}/>
            <div className={styles.container_content_text}>
                <p>Мисковец В.С. родился 20 ноября 1961года в семье рабочего в городе Киев. Воинское звание — генерал-майор. В 1984 году окончил 	Киевское высшее танковое инженерное училище, в 1988 году — Военную академию бронетанковых войск.  Проходил службу на воинских должностях в войсках, научно-исследовательских учреждениях, кадровых органах и органах военно-политической работы. 	Последние должности: начальник управления кадров Ленинградского и Западного военных округов (2010-2018 гг.), заместитель начальника Главного военно-политического управления Вооруженных Сил Российской Федерации (2018-2021 гг.). Участник боевых действий в Северо-Кавказском регионе и Сирийской Арабской Республике. С марта 2022 г. Мисковец Виктор Степанович — первый заместитель председателя Московского городского совета ветеранов. Член Комиссии по увековечиванию памяти выдающихся событий и деятелей отечественной истории и культуры при Правительстве Москвы. Кандидат военных наук. Имеет Почетное звание «Заслуженный военный специалист Российской Федерации» Награды: Орден «За военные заслуги»   Орден Почета Орден Дружбы Медаль ордена «За заслуги перед Отечеством» II степени Медаль «Участнику военной операции в Сирии»",</p>
            
            </div>
        </div>
        <div className={styles.container_button}>
            <Link to="/directors">
                <BeforePageButton/>
            </Link>
        </div>
    </div>
    )
}

export default Miscovec;