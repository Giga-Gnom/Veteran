import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./AdminNewspapersWindow.module.css"
import newspapersService from "../../../services/newspapersService";


const AdminNewspapersWindow = () => {
    const [years, setYears] = useState([])
    const [loading, setLoadin] = useState(false)
    const [quarters, setQuarters] = useState(null)
    const [showAddQuarterModal, setShowAddQuarterModal] = useState(false)
    const [newYear, setNewYear] = useState("");
    const yearInputRef = useRef(null)
    const quarterInputRef = useRef(null)
    const [showAddYearModal, setShowAddYearModal] = useState(false)
    const [selectedYear, setSelectedYear] = useState(null)
    const [newQuarter, setNewQuarter] = useState({
    quarter: "",
    title: ""
})
    const [selectedQuarter, setSelectedQuarter] = useState(null)

    useEffect(() => {
        loadYears()
    }, [])

    useEffect(() => {
        if (selectedYear){
            loadQuartersForYear(selectedYear.id);
        }
    }, [selectedYear])

    useEffect(() => {
        if (showAddYearModal && yearInputRef.current) {
            setTimeout(() => {
                yearInputRef.current?.focus()
            }, 100)
        }
    })

    useEffect(() => {
        if (showAddQuarterModal && quarterInputRef.current) {
            setTimeout(() => {
                quarterInputRef.current.focus()
            }, 100)
        }
    })

    const handleCloseYearModal = () => {
        setNewYear("")
        setShowAddYearModal(false)
    }

    const handleCloseQuarterModal = () => {
        setNewQuarter({
            quarter: "",
            title: ""
        })
        setShowAddQuarterModal(false)
    }

    const loadYears = async () => {
        try {
            setLoadin(true)
            const YearsData = await newspapersService.getAllYearsWithQuarters();
            setYears(YearsData)
            if (YearsData.length > 0 && !selectedYear) {
                setSelectedYear(YearsData[0]);
            } 
        } catch (error) {
            console.log("error loading years: ", error)
        } finally {
            setLoadin(false)
        }
    }

    const loadQuartersForYear = async (yearId) => {
        try {
            const quartersData = await newspapersService.getQuartersByYear(yearId);
            setQuarters(quartersData)
        } catch (error) {
            console.error("error fetching quarters by year: ", error)
        }
    }


    const handleAddYear = async () => {
        if (!newYear || !newYear.match(/^\d{4}$/)) {
            alert("Введите корректный год (4 цифры)");
            return;
        }

        const yearValue = parseInt(newYear)
        if (yearValue < 1994 || yearValue > 2100) {
            alert("Год должен быть между 1994 и 2100");
            return;
        }
        
        try {
            const yearData = {
                year: yearValue,
                title: `${yearValue} год`
            }

            await newspapersService.addYear(yearData)
            setNewYear("")
            setShowAddYearModal(false)
            loadYears()
            // alert(`Год ${yearValue} успешно добавлен`);
        } catch (error) {
            console.error("error adding year: ", error)
            // alert("Ошибка при добавлении года, возможно такой год уже добавлен!")
        }
    }

    const handleYearSelect = (year) => {
        setSelectedYear(year)
    }

    const handleDeleteYear = async (yearId, yearValue) => {
        if (!window.confirm(`Вы уверены что хотите удалить ${yearValue} год и все с ним связанное?`)) {
            return
        }

        try {
            await newspapersService.deleteYear(yearId)
            loadYears()
            if (selectedYear?.id === yearId) {
                setSelectedYear(null)
                setQuarters([])
            }
            alert(`Год ${yearValue} успешно удален.`)
        } catch (error) {
            console.error("Error deleting year:", error);
            alert("Ошибка при удалении года");
        }
    }

    const handleDeleteQuarter = async (quarterId, quarterTitle) => {
        if (!window.confirm(`Вы действительно хотите удалить "${quarterTitle}" квартал и все с ним связанное?`))
            return

        try {
            await newspapersService.deleteQuarter(quarterId)
            if (selectedYear) {
                loadQuartersForYear(selectedYear.id)
            }
        } catch (error) {
            console.log("error deleting quarter: ", error)
            alert("Ошибка удаления квартала")
        }
    }

    const handleAddQuarter = async () => {
        if (!selectedYear) {
            alert("Сначала выберите год")
            return
        }

        const quarterNum = parseInt(newQuarter.quarter)
        if (!quarterNum || quarterNum > 4 || quarterNum < 1) {
            alert("Выберите квартал в пределах от 1 до 4")
            return
        }

        if (!newQuarter.title.trim()) {
            alert("добавьте заголовок для квартала")
            return
        }

        try {
            const quarterData = {
                year_id : selectedYear.id,
                quarter: quarterNum,
                title: newQuarter.title.trim(),
            }
            const currentYearId = selectedYear.id;
            setShowAddQuarterModal(false)

            await newspapersService.addQuarter(quarterData)

            loadQuartersForYear(currentYearId)
            // alert(`Квартал "${quarterData.title}" успешно добавлен`)
        } catch (error) {
            console.error("error adding quarter: ", error)
            alert("Ошибка при добавлении квартала. Возможно такой квартал уже существует.")
        }
    }

    const handleQuarterInputChange = (e) => {
        const {name, value} = e.target
        setNewQuarter(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOpenAddQuarterModal = () => {
    if (!selectedYear) {
        alert("Сначала выберите год");
        return;
    }
    
    // Сброс формы
    setNewQuarter({
        quarter: "",
        title: ""
    });
    
    // Открытие модалки
    setShowAddQuarterModal(true);
};

    return(
        <div className={styles.container}>
            <div className={styles.years_widget}>
                <div className={styles.carousel_container}>
                    <div className={styles.carousel}>
                        <div className={styles.carousel_group}>
                            {loading ? (
                                <div className={styles.year_card} style={{ background: '#e9ecef' }}>
                                    <p style={{ color: '#6c757d' }}>Загрузка...</p>
                                </div>
                            ) : years.length === 0 ? (
                                <div className={styles.year_card} style={{ background: '#e9ecef' }}>
                                    <p style={{ color: '#6c757d' }}>Нет добавленных годов</p>
                                </div>
                            ) : (
                                years.map((year) => (
                                    <div
                                        key={year.id}
                                        className={`${styles.year_card} ${selectedYear?.id === year.id ? styles.active : ''}`}
                                        onClick={() => handleYearSelect(year)}
                                    >
                                        <h3 className={styles.year_number}>{year.year}</h3>
                                        <span className={styles.year_count}>
                                            {year.newspaper_count || 0} выпусков
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <button className={styles.add_year_btn} onClick={() => setShowAddYearModal(true)}>
                    <span className={styles.icon}>+</span>
                    <span>Добавить год</span>
                </button>
            </div>

            {selectedYear && 
            (
                <div className={styles.quarters_section}>
                    <div className={styles.section_header}>
                        <h3 className={styles.section_title}>
                            {selectedYear.year} год - Кварталы
                        </h3>
                        <div className={styles.section_actions}>
                            <button 
                                className={styles.add_quarter_btn}
                                onClick={handleOpenAddQuarterModal}
                            >
                                + Добавить квартал
                            </button>
                            <button 
                                className={styles.delete_year_btn}
                                onClick={() => handleDeleteYear(selectedYear.id, selectedYear.year)}
                            >
                                Удалить год
                            </button>
                        </div>
                    </div>
                    
                    {quarters?.length === 0 ? (
                        <div className={styles.empty_state}>
                            <div className={styles.icon}>📂</div>
                            <p>Нет кварталов для этого года</p>
                            <button 
                                className={styles.add_first_quarter}
                                onClick={() => setShowAddQuarterModal(true)}
                            >
                                + Добавить первый квартал
                            </button>
                        </div>
                    ) : (
                        <div className={styles.quarters_grid}>
                            {quarters?.map((quarter) => (
                                <div key={quarter.id} className={styles.quarter_card}>
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
                                    <div className={styles.quarter_actions}>
                                        <button className={`${styles.action_btn} ${styles.view_btn}`}>
                                            Просмотреть газеты
                                        </button>
                                        <button 
                                            className={`${styles.action_btn} ${styles.delete_btn}`}
                                            onClick={() => handleDeleteQuarter(quarter.id, quarter.title || `${quarter.quarter} квартал`)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {showAddYearModal && (
                <div className={styles.modal_overlay} onClick={() => setShowAddYearModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Добавить новый год</h3>
                        <div className={styles.form_group}>
                            <label htmlFor="year">Год</label>
                            <input
                            ref={yearInputRef}
                                type="number"
                                id="year"
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                placeholder="Например: 2024"
                                min="1994"
                                max="2100"
                            />
                        </div>
                        <div className={styles.modal_actions}>
                            <button 
                                className={styles.cancel_btn}
                                onClick={handleCloseYearModal}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.submit_btn}
                                onClick={handleAddYear}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddQuarterModal && selectedYear && (
            <div className={styles.modal_overlay} onClick={() => setShowAddQuarterModal(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <h3>Добавить квартал для {selectedYear.year} года</h3>
                    
                    <div className={styles.form_group}>
                        <label htmlFor="quarter">Номер квартала *</label>
                        <select
                            id="quarter"
                            name="quarter"
                            value={newQuarter.quarter}
                            onChange={handleQuarterInputChange}
                            required
                        >
                            <option value="">Выберите квартал</option>
                            <option value="1">1 квартал (январь-март)</option>
                            <option value="2">2 квартал (апрель-июнь)</option>
                            <option value="3">3 квартал (июль-сентябрь)</option>
                            <option value="4">4 квартал (октябрь-декабрь)</option>
                        </select>
                    </div>
                    
                    <div className={styles.form_group}>
                        <label htmlFor="quarterTitle">Название квартала *</label>
                        <input
                        ref={quarterInputRef}
                            type="text"
                            id="quarterTitle"
                            name="title"
                            value={newQuarter.title}
                            onChange={handleQuarterInputChange}
                            placeholder="Например: Весенние выпуски"
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className={styles.modal_actions}>
                        <button 
                            className={styles.cancel_btn}
                            onClick={handleCloseQuarterModal}
                        >
                            Отмена
                        </button>
                        <button 
                            className={styles.submit_btn}
                            onClick={handleAddQuarter}
                        >
                            Добавить квартал
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}

export default AdminNewspapersWindow;