import React, { useEffect, useState } from "react";
import styles from "./NewspaperWindow.module.css"
import page1 from "./srcNewspapers/image.png"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { newspapersArray } from "./newspapersArray";
import RefBlock from "./refBlock";
import NewspapersDoc from "./NewspapersDoc";
import newspapersService from "../../../services/newspapersService";

const NewspaperWindow = () => {
    const [currentDocument, setCurrentDocument] = useState(null);
    const [loading, setLoading] = useState(false)
    const [years, setYears] = useState([])
    const [currentYear, setCurrentYear] = useState(null)
    const [quarters, setQuarters] = useState([])
    const [currentQuarter, setCurrentQuarter] = useState(null)
    const [newspapers, setNewspapers] = useState([])
    const [activeView, setActiveView] = useState('years')

    useEffect(() => {
        loadYears()
    }, [])

    useEffect(() => {
        if(currentYear){
            loadingQuartersForYear(currentYear.id)
        }
    }, [currentYear])

    useEffect(() => {
        if (currentQuarter) {
            loadingNewspapersForQuarter(currentQuarter.id)
        } else {
            setNewspapers([])
        }
    }, [currentQuarter])

    const loadYears = async () => {
        try {
            setLoading(true)
            const yearsData = await newspapersService.getAllYearsWithQuarters()
            setYears(yearsData)
    
            if (years.length > 0 && !currentYear) {
                setCurrentYear(yearsData[0])
                setActiveView('years')
            }
        } catch (error) {
            console.error("error fetching years: ", error)
        } finally {
            setLoading(false)
        }
    } 

    const loadingQuartersForYear = async (yearId) => {
        try {
            setLoading(true)
            const quartersData = await newspapersService.getQuartersByYear(yearId)
            setQuarters(quartersData)
            setCurrentQuarter(null)
            setActiveView('quarters')
        } catch (error) {
            console.error("error fetching quarters for year: ", error)
        } finally {
            setLoading(false)
        }
    }

    const loadingNewspapersForQuarter = async (quarterId) => {
        try{
            setLoading(true)
            const newsData = await newspapersService.getNewsPapersByQuarter(quarterId)
            setNewspapers(newsData)
            setActiveView('newspapers')
        } catch (error) {
            console.error("error fetching newspapers for quarter: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleYearSelect = (year) => {
        setCurrentYear(year)
        setActiveView('quarters')
    }

    const handleQuarterSelect = (quarter) => {
        setCurrentQuarter(quarter)
        setActiveView('newspapers')
    }

    const handleBackToYears = () => {
        setCurrentYear(null)
        setCurrentQuarter(null)
        setActiveView('years')
    }

    const handleBackToQuarter = () => {
        setCurrentQuarter(null)
        setActiveView('quarters')
    }
    
        const handleShowDocument = (newspaper) => {
            setCurrentDocument(newspaper.file_path);
        };
    
        const handleCloseDocument = () => {
            setCurrentDocument(null)
        }

        const formatDate = (dateString) => {
        if (!dateString) return "Дата не указана";
        try {
            return new Date(dateString).toLocaleDateString('ru-RU');
        } catch (error) {
            return dateString;
        }
    };

    return(
        <div className={styles.container}>
            {!currentDocument && ( // Показываем шапку только когда документ закрыт
                <div className={styles.container_head}>            
                    <MyHat heading="Газета «Московский ветеран»"/>
                </div>
            )}
            <div className={styles.container_content}>
                {currentDocument ? (
                    <NewspapersDoc 
                        path={currentDocument} 
                        onClose={handleCloseDocument}
                    />
                ) : (
                    <div className={styles.newspapers_selector}>
                        <div className={styles.info_section}>
                            <img src={page1} alt="Газета Московский ветеран" className={styles.container_content_text_image}/>
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
                        </div>

                        {/* Навигационная панель */}
                        <div className={styles.navigation_bar}>
                            <button 
                                className={styles.nav_btn}
                                onClick={handleBackToYears}
                                disabled={activeView === 'years'}
                            >
                                Все годы
                            </button>
                            
                            {currentYear && (
                                <>
                                    <span className={styles.nav_separator}>›</span>
                                    <button 
                                        className={styles.nav_btn}
                                        onClick={handleBackToQuarter}
                                        disabled={activeView === 'quarters'}
                                    >
                                        {currentYear.year} год
                                    </button>
                                </>
                            )}
                            
                            {currentQuarter && (
                                <>
                                    <span className={styles.nav_separator}>›</span>
                                    <span className={styles.nav_current}>
                                        {currentQuarter.title || `${currentQuarter.quarter} квартал`}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className={styles.selector_content}>
                            {loading ? (
                                <div className={styles.loading}>
                                    Загрузка...
                                </div>
                            ) : (
                                <>
                                    {/* Вид выбора года */}
                                    {activeView === 'years' && (
                                        <div className={styles.years_grid}>
                                            {years.length === 0 ? (
                                                <div className={styles.empty_state}>
                                                    <p>Нет доступных годов</p>
                                                </div>
                                            ) : (
                                                years.map((year) => (
                                                    <div
                                                        key={year.id}
                                                        className={`${styles.year_card} ${currentYear?.id === year.id ? styles.active : ''}`}
                                                        onClick={() => handleYearSelect(year)}
                                                    >
                                                        <div className={styles.year_number}>{year.year}</div>
                                                        <div className={styles.year_count}>
                                                            {year.newspaper_count || 0} выпусков
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {activeView === 'quarters' && currentYear && (
                                        <div className={styles.quarters_section}>
                                            <h3 className={styles.section_title}>
                                                {currentYear.year} год - Кварталы
                                            </h3>
                                            
                                            {quarters.length === 0 ? (
                                                <div className={styles.empty_state}>
                                                    <p>Нет кварталов для этого года</p>
                                                </div>
                                            ) : (
                                                <div className={styles.quarters_grid}>
                                                    {quarters.map((quarter) => (
                                                        <div
                                                            key={quarter.id}
                                                            className={styles.quarter_card}
                                                            onClick={() => handleQuarterSelect(quarter)}
                                                        >
                                                            <div className={styles.quarter_header}>
                                                                <h4 className={styles.quarter_title}>
                                                                    {quarter.title || `${quarter.quarter} квартал`}
                                                                </h4>
                                                                <span className={styles.quarter_count}>
                                                                    {quarter.newspaper_count || 0} выпуск.
                                                                </span>
                                                            </div>
                                                            {quarter.description && (
                                                                <p className={styles.quarter_description}>
                                                                    {quarter.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {activeView === 'newspapers' && currentQuarter && (
                                        <div className={styles.newspapers_section}>
                                            <h3 className={styles.section_title}>
                                                Газеты: {currentQuarter.title || `${currentQuarter.quarter} квартал`} ({currentYear?.year})
                                            </h3>
                                            
                                            {newspapers.length === 0 ? (
                                                <div className={styles.empty_state}>
                                                    <p>Нет газет для этого квартала</p>
                                                </div>
                                            ) : (
                                                <div className={styles.newspapers_list}>
                                                    {newspapers.map((newspaper) => (
                                                        <div
                                                            key={newspaper.id}
                                                            className={styles.newspaper_card}
                                                            onClick={() => handleShowDocument(newspaper)}
                                                        >
                                                            <div className={styles.newspaper_info}>
                                                                <h4 className={styles.newspaper_title}>
                                                                    {newspaper.title}
                                                                </h4>
                                                                <div className={styles.newspaper_meta}>
                                                                    <span className={styles.newspaper_date}>
                                                                        {formatDate(newspaper.issue_date)}
                                                                    </span>
                                                                    {newspaper.issue_number && (
                                                                        <span className={styles.newspaper_number}>
                                                                            №{newspaper.issue_number}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={styles.newspaper_action}>
                                                                <button className={styles.view_btn}>
                                                                    Просмотреть
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>    
                    </div>
                )}
            <p style={{fontStyle:'italic'}} className={styles.container_content_text_primechanie}>Примечание:
                    Газета зарегистрирована в Управлении Федеральной Службы по надзору в сфере связи, информационных технологий и массовых коммуникаций  по Москве и Московской области.
                    ПИ № ТУ 50-838 от 10.11.2010 г.
                    Адрес редакции: 127006, Москва, ул. Малая Дмитровка, д.2</p>
                    <br /><br /><br /><br />
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
