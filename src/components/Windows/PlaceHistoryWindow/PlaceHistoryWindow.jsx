import React from "react";
import styles from "./PlaceHistoryWindow.module.css";
import page1 from "./srcPlace/Building.jpg";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { handleImgClick } from "../../../app/utils";

const PlaceHistoryWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>            
                <MyHat heading="ИСТОРИЯ НАШЕГО ДОМА. МАЛАЯ ДМИТРОВКА Д. 2, СТР. 1" customClass={styles.h1_header}/>
            </div>
            <div className={styles.container_content}>
                <div className={styles.container_content_text}>
                    <figure className={styles.container_content_text_img}>
                        <img src={page1} className={styles.container_content_text_img_img} alt=""  onClick={handleImgClick}/>
                        <p>Малая Дмитровка д.2 стр. 1</p>
                    </figure>
                    <div className={styles.indent_text}>
                        <h1>История нашего Дома</h1> 
                        <p>Малая Дмитровка 2 – Доходное владение начала XX века</p>
                        <p>Четырехэтажный доходный дом на углу улицы Малая Дмитровка и Большого 
                            Путинковского переулка возвели в 1911 году. Здание выделяется легкой угловой ротондой, 
                            нависающей над первым этажом. Проект владения выполнил архитектор Леонид Васильевич Стеженский.
                            </p>
                        <p>История этого дома связана с жившим здесь оперным певцом, а потом и одним из руководителей 
                            оперной труппы Императорского Большого театра Владимиром Аполлоновичем Лосским. 
                            Именно по его инициативе был осуществлен первый в Большом театре спектакль на 
                            революционный сюжет – «Героическое действо» с музыкой В. В. Небольсина. В доме 
                            устраивались литературно-музыкальные салоны, собирались известные писатели, артисты, 
                            музыканты.</p>
                        <p>В 1927 году одну из квартир занимал литературовед Василий Львович Рогачевский, 
                            которого часто посещал Сергей Есенин.</p>
                        <p>Рядом расположена церковь Рождества богородицы в Путинках в стиле «русское узорочье» (1646-1652)
                            - выдающийся памятник древнерусского зодчества.</p>
                    </div>
                </div>
            </div>
            <div className={styles.container_head}>            
                <BottomPanel/>
            </div>
        </div>
    )
}

export default PlaceHistoryWindow;