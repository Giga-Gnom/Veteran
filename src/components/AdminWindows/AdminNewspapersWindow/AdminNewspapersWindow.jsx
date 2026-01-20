import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./AdminNewspapersWindow.module.css"
import newspapersService from "../../../services/newspapersService";
import { ErrorMassage } from "../admin_components/ErrorMassage";


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
    const [newspapers, setNewspapers] = useState([])
    const [loadingNewspapers, setLoadingNewspapers] = useState(false)
    const [showAddNewspaperModal, setShowAddNewspaperModal] = useState(false)
    const [newNewspaper, setNewNewspaper] = useState({
        title: "",
        file_name: "",
        file: null,
        issue_date: "",
        issue_number: ""
    })
    const newspaperTitleRef = useRef(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadYears()
    }, [])

    useEffect(() => {
        if (selectedYear){
            loadQuartersForYear(selectedYear.id);
        }
    }, [selectedYear])

    useEffect(() => {
        if (selectedQuarter) {
            loadNewspapersForQuarter(selectedQuarter.id)
        } else {
            setNewspapers([])
        }
    }, [selectedQuarter])

    useEffect(() => {
        if (showAddYearModal && yearInputRef.current) {
            setTimeout(() => {
                yearInputRef.current?.focus()
            }, 100)
        }
    },[showAddYearModal])

    useEffect(() => {
        if (showAddQuarterModal && quarterInputRef.current) {
            setTimeout(() => {
                quarterInputRef.current.focus()
            }, 100)
        }
    }, [showAddQuarterModal])

    useEffect(() => {
        if (showAddNewspaperModal && newspaperTitleRef.current) {
            setTimeout(() => {
                newspaperTitleRef.current?.focus()
            }, 100)
        }
    }, [showAddNewspaperModal])

    const showError = (message) => {
        setError(message)
    }

    const clearError = () => {
        setError(null)
    }

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

    const handleCloseNewspaperModal = () => {
        setNewNewspaper({
            title:"",
            file_name:"",
            file: null,
            issue_date:"",
            issue_number:""
        })
        setShowAddNewspaperModal(false)
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
            setSelectedQuarter(null)
        } catch (error) {
            console.error("error fetching quarters by year: ", error)
        }
    }

    const loadNewspapersForQuarter = async (quarterID) => {
        try{
            setLoadingNewspapers(true)
            const newspapersData = await newspapersService.getNewsPapersByQuarter(quarterID)
            setNewspapers(newspapersData)
        } catch (error) {
            console.error("error loading newspapers for quarter: ", error)
        } finally {
            setLoadingNewspapers(false)
        }
    }


    const handleAddYear = async () => {
        if (!newYear || !newYear.match(/^\d{4}$/)) {
            showError("Введите корректный год (4 цифры)");
            return;
        }

        const yearValue = parseInt(newYear)
        if (yearValue < 1994 || yearValue > 2100) {
            showError("Год должен быть между 1994 и 2100");
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

    const handleQuarterSelect = (quarter) => {
        setSelectedQuarter(quarter)
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
            showError(`Год ${yearValue} успешно удален.`)
        } catch (error) {
            console.error("Error deleting year:", error);
            showError("Ошибка при удалении года");
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
            showError("Ошибка удаления квартала")
        }
    }

    const handleDeleteNewspaper = async (newspaperID, newspaperTitle) => {
        if (!window.confirm(`Вы действительно хотите удалить газету - ${newspaperTitle}, и все что с ней связано?`))
            return

        try{
            await newspapersService.deleteNewspaper(newspaperID)
            if (selectedQuarter) {
                loadNewspapersForQuarter(selectedQuarter.id)
            }
        } catch (error) {
            console.error("error deleting newspaper: ", error)
        }
    }

    const handleAddQuarter = async () => {
        if (!selectedYear) {
            showError("Сначала выберите год")
            return
        }

        const quarterNum = parseInt(newQuarter.quarter)
        if (!quarterNum || quarterNum > 4 || quarterNum < 1) {
            showError("Выберите квартал в пределах от 1 до 4")
            return
        }

        if (!newQuarter.title.trim()) {
            showError("добавьте заголовок для квартала")
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
            showError("Ошибка при добавлении квартала. Возможно такой квартал уже существует.")
        }
    }

    const handleAddNewspaper = async () => {
        if (!selectedQuarter) {
            showError("Выберите квартал")
            return
        }

        if (!newNewspaper.title.trim()) {
            showError("Введите название газеты")
            return
        }

        if (!newNewspaper.issue_date) {
            showError("Выберите дату выпуска")
            return
        }

        if (!newNewspaper.file) {
            showError("Выберите файл газеты")
            return
        }

        try{
            const arrayBuffer = await newNewspaper.file.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const fileResult = await window.electronAPI.file.save(newNewspaper.file.name, buffer)
            
            const newspaperData = {
                quarter_id: selectedQuarter.id,
                title: newNewspaper.title.trim(),
                issue_date: newNewspaper.issue_date,
                issue_number: newNewspaper.issue_number || "",
                file_name: fileResult.file_name,
                file_path: fileResult.file_path
            }

            await newspapersService.addNewspaper(newspaperData)

            handleCloseNewspaperModal()

            if (selectedQuarter) {
                loadNewspapersForQuarter(selectedQuarter.id)
            }
        } catch (error) {
            console.error("error adding newspaper: ", error)
        }
    }

    const handleQuarterInputChange = (e) => {
        const {name, value} = e.target
        setNewQuarter(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNewspaperInputChange = (e) => {
        const {name, value} = e.target
        setNewNewspaper(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const allowedTypes = ['pdf']
            const fileExtension = file.name.split('.').pop().toLowerCase()
            if (allowedTypes.includes(fileExtension)) {
                setNewNewspaper(prev => ({
                    ...prev,
                    file: file,
                    file_name: file.name
                }))
            } else {
                showError("Разрешены только PDF файлы")
                e.target.value = ""
            }
        }
    }

    const handleOpenAddQuarterModal = () => {
        if (!selectedYear) {
            showError("Сначала выберите год");
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

    const handleOpenAddNewspaperModal = () => {
        if (!selectedYear || !selectedQuarter) {
            showError("Выберете год и квартал")
            return
        }

        setShowAddNewspaperModal(true)
    }

    const formatDate = (dateString) => {
        if(!dateString) return "НЕТ ДАТЫ"
        try {
            return new Date(dateString).toLocaleDateString('ru-RU')
        } catch (error) {
            return dateString;
        }
    }

    return(
        <div className={styles.container}>
                        {error && (
                            <ErrorMassage 
                                message={error} 
                                onClose={clearError}
                            />
                        )}
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

            {selectedQuarter ? (
                <div className={styles.newspapers_section}>
                    <div className={styles.section_header}>
                        <h3 className={styles.section_title}>
                            Газеты: {selectedQuarter.title || `${selectedQuarter.quarter} квартал`} ({selectedYear?.year})
                        </h3>
                        <div className={styles.section_actions}>
                            <button 
                                className={styles.add_newspaper_btn}
                                onClick={handleOpenAddNewspaperModal}
                            >
                                + Добавить газету
                            </button>
                            <button 
                                className={styles.back_to_quarters_btn}
                                onClick={() => setSelectedQuarter(null)}
                            >
                                ← Назад к кварталам
                            </button>
                        </div>
                    </div>
                    {loadingNewspapers ? (
                        <div className={styles.loading_state}>
                            <p>Загрузка газет...</p>
                        </div>
                    ) : newspapers.length === 0 ? (
                        <div className={styles.empty_state}>
                            <div className={styles.icon}>📰</div>
                            <p>Нет газет для этого квартала</p>
                            <button 
                                className={styles.add_first_newspaper}
                                onClick={handleOpenAddNewspaperModal}
                            >
                                + Добавить первую газету
                            </button>
                        </div>
                    ) : (
                        <div className={styles.newspapers_table_container}>
                            <table className={styles.newspapers_table}>
                                <thead className={styles.newspapersTable__header}>
                                    <tr>
                                        <th>Название</th>
                                        <th>Дата выпуска</th>
                                        <th>Номер выпуска</th>
                                        <th>Файл</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newspapers.map((newspaper) => (
                                        <tr key={newspaper.id}>
                                            <td className={styles.newspaper_title}>{newspaper.title}</td>
                                            <td>{formatDate(newspaper.issue_date)}</td>
                                            <td>{newspaper.issue_number || '—'}</td>
                                            <td>
                                                <span className={styles.file_name}>
                                                    {newspaper.file_name}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.newspaper_actions}>
                                                    <button 
                                                        className={`${styles.actionPaper_btn} ${styles.view_newspaper_btn}`}
                                                        onClick={() => window.open(newspaper.file_path, '_blank')}
                                                    >
                                                        Просмотреть
                                                    </button>
                                                    <button 
                                                        className={`${styles.actionPaper_btn} ${styles.delete_newspaper_btn}`}
                                                        onClick={() => handleDeleteNewspaper(newspaper.id, newspaper.title)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : selectedYear && (
                // ДОБАВИТЬ: onClick на карточку квартала
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
                                <div 
                                    key={quarter.id} 
                                    className={styles.quarter_card}
                                    onClick={() => handleQuarterSelect(quarter)} // ДОБАВИТЬ: выбор квартала
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
                                    <div className={styles.quarter_actions}>
                                        <button 
                                            className={`${styles.action_btn} ${styles.view_btn}`}
                                            onClick={(e) => {
                                                e.stopPropagation() // ДОБАВИТЬ: чтобы не срабатывал onClick карточки
                                                handleQuarterSelect(quarter)
                                            }}
                                        >
                                            Просмотреть газеты
                                        </button>
                                        <button 
                                            className={`${styles.action_btn} ${styles.delete_btn}`}
                                            onClick={(e) => {
                                                e.stopPropagation() // ДОБАВИТЬ: чтобы не срабатывал onClick карточки
                                                handleDeleteQuarter(quarter.id, quarter.title || `${quarter.quarter} квартал`)
                                            }}
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

        {showAddNewspaperModal && selectedQuarter && (
                <div className={styles.modal_overlay} onClick={handleCloseNewspaperModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Добавить газету в {selectedQuarter.title || `${selectedQuarter.quarter} квартал`}</h3>
                        
                        <div className={styles.form_group}>
                            <label htmlFor="newspaperTitle">Название газеты *</label>
                            <input
                                ref={newspaperTitleRef}
                                type="text"
                                id="newspaperTitle"
                                name="title"
                                value={newNewspaper.title}
                                onChange={handleNewspaperInputChange}
                                placeholder="Например: Вестник Ветерана"
                                required
                            />
                        </div>
                        
                        <div className={styles.form_group}>
                            <label htmlFor="issueDate">Дата выпуска *</label>
                            <input
                                type="date"
                                id="issueDate"
                                name="issue_date"
                                value={newNewspaper.issue_date}
                                onChange={handleNewspaperInputChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.form_group}>
                            <label htmlFor="issueNumber">Номер выпуска (опционально)</label>
                            <input
                                type="text"
                                id="issueNumber"
                                name="issue_number"
                                value={newNewspaper.issue_number}
                                onChange={handleNewspaperInputChange}
                                placeholder="Например: №1, Выпуск 5"
                            />
                        </div>
                        
                        <div className={styles.form_group}>
                            <label htmlFor="newspaperFile">Файл газеты (PDF) *</label>
                            <div className={styles.file_upload_container}>
                                <input
                                    type="file"
                                    id="newspaperFile"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className={styles.file_input}
                                />
                                <label htmlFor="newspaperFile" className={styles.file_upload_label}>
                                    {newNewspaper.file_name ? newNewspaper.file_name : 'Выберите файл PDF'}
                                </label>
                            </div>
                            {newNewspaper.file_name && (
                                <div className={styles.file_selected}>
                                    Выбран файл: {newNewspaper.file_name}
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.modal_actions}>
                            <button 
                                className={styles.cancel_btn}
                                onClick={handleCloseNewspaperModal}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.submit_btn}
                                onClick={handleAddNewspaper}
                            >
                                Добавить газету
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminNewspapersWindow;