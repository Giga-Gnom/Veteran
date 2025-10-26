import React, { useState } from "react";
import styles from "./NewspaperWindow.module.css"
import page1 from "./srcNewspapers/image.png"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { newspapersArray } from "./newspapersArray";
import RefBlock from "./refBlock";
import NewspapersDoc from "./NewspapersDoc";

const NewspaperWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    
        const handleShowDocument = (path) => {
            setCurrentDocument(path);
        };
    
        const handleCloseDocument = () => {
            setCurrentDocument(null)
        }

    return(
        <div className={styles.container}>
            {!currentDocument && ( // Показываем шапку только когда документ закрыт
                <div className={styles.container_head}>            
                    <MyHat heading="Газета «Московский ветеран»"/>
                </div>
            )}
            <div className={styles.container_content}>
                <div className={styles.container_content_text}>
                    <img src={page1} alt="" className={styles.container_content_text_image}/>
                    <h1 className={styles.container_content_text_h1}></h1>
                    <p >Газета выходит с  октября 1994 года. В разные годы газета выходила на 4-х полосах 2 раза в месяц и 8-ми полосах 3 раза в месяц. Тираж газеты варьировался от 1 000 экз., до 10 тыс. экз. Сегодня газета выходит на 8-ми полосах 3 раза в месяц общим тиражом 7 тыс.экз.</p>
                    <p>Ранее газета печаталась в типографии г. Подольска на газетной бумаге (более низкое качество, но соответственно более низкая цена). Это позволяло издавать тираж 10 тыс.экз. Но нарекания к качеству газеты были постоянны. В связи с чем была проведена работа по выбору другой типографии и выбору более качественной бумаги. Согласно указанию руководства МГСВ редакция остановилась на типографии «Красная Звезда». На сегодняшний день сокращено количество тиража до 7 тыс.экз. При этом значительно повысилось качество издания. </p>
                    <p>Также нужно отметить, что изменилась верстка газеты. Редакция поменяла дизайнера, что несомненно положительно повлияло на вид и имидж газеты.</p>
                    <p>За прошедшее время газета переживала разные периоды наполняемости. Бывали годы, когда корреспондентская сеть работала плохо, что сказывалось на информационной составляющей газеты. Но сегодня ситуация изменилась радикально. В связи с появлением в округах пресс-секретарей, удалось расширить тематику публикуемых материалов, глубже освещать жизнь и работу ветеранских организаций столицы. На страницах газеты были опубликованы программные интервью с председателями окружных Советов ветеранов,  с первыми заместителями председателя МГСВ и руководителями отделов. Слаженная работа команды пресс-секретарей позволяет собирать, обобщать и размещать тематические материалы из каждого округа, района и первичек.</p>
                    <p>Особое внимание редакция уделяет информированию читателей о днях воинской славы, исторических датах России, профессиональных праздниках, что на наш взгляд способствует сохранению исторических и культурных традиций.  Также редакции удалось активизировать работу по подготовке материалов от общественных комиссий МГСВ, методического отдела, лекторской группы и отделов совета.</p>

                    <p>Учредитель газеты – МГОВ</p>
                    <p>Редакционный совет:</p>
                    <p>1.	Пашков Г.И. – председатель</p>
                    <p>2.	Аксенов А.П.</p>
                    <p>3.	Мисковец В.С.</p>
                    <p>4.	Акчурин Р.С.</p>
                    <p>5.	Сосунова Л.В.</p>
                    <p>6.	Нешина Т.Д.</p>
                    <p>7.	Бабич О.С.</p>
                    <p>8.	Клепиков А.Н.</p>
                    <p>9.	Лобанов М.П.</p>
                    <p>10.	Климова А.А. – главный редактор</p>
                    <br />

                    <div className={styles.container_content_text}>
                        {currentDocument ?
                        (<NewspapersDoc style={{zIndex: 2000}} path={currentDocument} onClose={handleCloseDocument}></NewspapersDoc>)
                        :
                        (newspapersArray.map((newspaper,index) => (<RefBlock style={styles.container_content_text_ref}  key={index} title={newspaper.title} onClick={()=>handleShowDocument(newspaper.ref)}/>)))
                        }
                    </div>
                    <br />
                    <p style={{fontStyle:'italic'}} className={styles.container_content_text_primechanie}>Примечание:
                    Газета зарегистрирована в Управлении Федеральной Службы по надзору в сфере связи, информационных технологий и массовых коммуникаций  по Москве и Московской области.
                    ПИ № ТУ 50-838 от 10.11.2010 г.
                    Адрес редакции: 127006, Москва, ул. Малая Дмитровка, д.2</p>
                    <br /><br /><br /><br />
                </div>
            </div>
            { !currentDocument && (
                <div className={styles.container_bottom}>            
                    <BottomPanel/>
                </div>
            )}
        </div>
    )
}

export default NewspaperWindow;
