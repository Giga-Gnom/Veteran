import React, { useState, useEffect } from "react";
import styles from "./AdminStatisticsWindow.module.css";
import statisticsService from "../../../services/statisticsService";

const AdminStatisticsWindow = () => {
    const [charts, setCharts] = useState([]);
    const [selectedChart, setSelectedChart] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [chartMetadata, setChartMetadata] = useState({
        chart_name: "",
        chart_type: "bar",
        sort_order: 0
    });
    const [showChartForm, setShowChartForm] = useState(false);
    
    // Состояния для модальных окон
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDatasetModal, setShowDatasetModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newDatasetData, setNewDatasetData] = useState({
        label: "",
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C"
    });

    useEffect(() => {
        loadAllCharts()
    }, [])

    const loadAllCharts = async () => {
        setIsLoading(true)
        try{
            const chartsData = await statisticsService.getAllFullCharts()
            
            // Дополнительно загружаем категории с ID для каждого графика
            const chartsWithCategories = await Promise.all(
                chartsData.map(async (chart) => {
                    if (chart.id) {
                        const categories = await statisticsService.getChartCategories(chart.id);
                        return {
                            ...chart,
                            categories: categories // добавляем массив категорий с ID
                        };
                    }
                    return chart;
                })
            );
            
            setCharts(chartsWithCategories)
            if (chartsWithCategories.length > 0 && !selectedChart) {
                setSelectedChart(chartsWithCategories[0]);
            }
        } catch (error) {
            console.error("error loading charts: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChartSelect = async (chartId) => {
        const chart = charts.find(c => c.id === chartId)
        if (chart) {
            // Загружаем категории с ID для выбранного графика
            const categories = await statisticsService.getChartCategories(chartId);
            setSelectedChart({
                ...chart,
                categories: categories
            });
            setEditingCell(null);
        }
    }

    const handleCellClick = async (datasetIndex, categoryIndex) => {
        if (!selectedChart) return

        const dataset = selectedChart.datasets[datasetIndex]
        const value = dataset.data[categoryIndex]
        setEditingCell({datasetIndex, categoryIndex})
        setTempValue(value.toString())
    }

    const handleCellChange = (e) => {
        setTempValue(e.target.value);
    };

    const saveCellValue = async () => {
        if (!editingCell || !selectedChart) return

        const {datasetIndex, categoryIndex} = editingCell
        const dataset = selectedChart.datasets[datasetIndex]
        
        // Получаем ID категории
        let categoryId;
        if (selectedChart.categories && selectedChart.categories[categoryIndex]) {
            categoryId = selectedChart.categories[categoryIndex].id;
        } else {
            // Если категорий нет в состоянии, пытаемся получить из БД
            const categories = await statisticsService.getChartCategories(selectedChart.id);
            if (categories && categories[categoryIndex]) {
                categoryId = categories[categoryIndex].id;
                // Обновляем состояние с категориями
                setSelectedChart({
                    ...selectedChart,
                    categories: categories
                });
            }
        }

        if (!dataset.id || !categoryId) {
            console.error("Не найдены ID датасета или категории", {
                datasetId: dataset.id,
                categoryId,
                categories: selectedChart.categories
            });
            return;
        }

        const newValue = parseFloat(tempValue)
        if (isNaN(newValue)) {
            return;
        }

        try{
            // Сначала проверяем существующие точки данных
            let dataPointId = null;
            const dataPoints = await statisticsService.getDataPointsForDataset(dataset.id);
            if (dataPoints && dataPoints.length > 0) {
                const dataPoint = dataPoints.find(dp => dp.category_id === categoryId);
                if (dataPoint) {
                    dataPointId = dataPoint.id;
                }
            }

            if (dataPointId) {
                await statisticsService.updateDataPoint(dataPointId, newValue);
            } else {
                await statisticsService.addDataPoint(dataset.id, categoryId, newValue);
            }
            
            // Обновляем локальное состояние
            const updatedCharts = [...charts];
            const chartIndex = updatedCharts.findIndex(c => c.id === selectedChart.id);
            
            if (updatedCharts[chartIndex].datasets[datasetIndex]) {
                updatedCharts[chartIndex].datasets[datasetIndex].data[categoryIndex] = newValue;
            }
            
            setCharts(updatedCharts);
            setSelectedChart(updatedCharts[chartIndex]);
            setEditingCell(null);
        } catch (error) {
            console.error("error connection: ", error)
        }
    }

    const openCategoryModal = () => {
        setNewCategoryName("");
        setShowCategoryModal(true);
    };

    const handleAddCategory = async () => {
        if (!selectedChart || !newCategoryName.trim()) return;

        try{
            const newCategory = {
                category_name: newCategoryName.trim(),
                sort_order: selectedChart.labels.length
            }

            const categoryId = await statisticsService.addCategory(selectedChart.id, newCategory);
            
            // Обновляем локальное состояние
            const updatedCharts = [...charts];
            const chartIndex = updatedCharts.findIndex(c => c.id === selectedChart.id);
            
            // Добавляем категорию
            updatedCharts[chartIndex].labels.push(newCategoryName.trim());
            
            // Добавляем категорию в массив категорий с ID
            if (!updatedCharts[chartIndex].categories) {
                updatedCharts[chartIndex].categories = [];
            }
            updatedCharts[chartIndex].categories.push({
                id: categoryId,
                category_name: newCategoryName.trim(),
                sort_order: selectedChart.labels.length
            });

            // Добавляем нулевые значения для всех датасетов
            updatedCharts[chartIndex].datasets.forEach(async (dataset) => {
                dataset.data.push(0);
                await statisticsService.addDataPoint(dataset.id, categoryId, 0);
            });

            setCharts(updatedCharts);
            setSelectedChart(updatedCharts[chartIndex]);
            setShowCategoryModal(false);
            setNewCategoryName("");
        } catch (error) {
            console.error("error adding category", error);
        }
    };

    const openDatasetModal = () => {
        setNewDatasetData({
            label: "",
            backgroundColor: "#4CAF50",
            borderColor: "#388E3C"
        });
        setShowDatasetModal(true);
    };

    const handleAddDataset = async () => {
        if (!selectedChart || !newDatasetData.label.trim()) return;

        try {
            const newDataset = {
                dataset_label: newDatasetData.label.trim(),
                dataset_color: newDatasetData.backgroundColor,
                border_color: newDatasetData.borderColor,
                sort_order: selectedChart.datasets.length
            };

            const datasetId = await statisticsService.addDataset(selectedChart.id, newDataset);
            
            const dataValues = selectedChart.labels.map(() => 0);
            
            // Создаем точки данных для всех категорий
            for (let i = 0; i < selectedChart.labels.length; i++) {
                const category = selectedChart.categories?.[i];
                if (category) {
                    await statisticsService.addDataPoint(datasetId, category.id, 0);
                }
            }

            // Обновляем локальное состояние
            const updatedCharts = [...charts];
            const chartIndex = updatedCharts.findIndex(c => c.id === selectedChart.id);
            
            updatedCharts[chartIndex].datasets.push({
                id: datasetId,
                label: newDatasetData.label.trim(),
                data: dataValues,
                backgroundColor: newDatasetData.backgroundColor,
                borderColor: newDatasetData.borderColor,
                borderWidth: 1
            });
            
            setCharts(updatedCharts);
            setSelectedChart(updatedCharts[chartIndex]);
            setShowDatasetModal(false);
            setNewDatasetData({
                label: "",
                backgroundColor: "#4CAF50",
                borderColor: "#388E3C"
            });
        } catch (error) {
            console.error("Ошибка добавления набора данных:", error);
        }
    };

    const handleDeleteCategory = async (categoryIndex) => {
        if (!selectedChart || !selectedChart.categories?.[categoryIndex]) return;
        if (!confirm("Удалить эту категорию?")) return;
        const categoryId = selectedChart.categories[categoryIndex].id;
        try {
            await statisticsService.deleteCategory(categoryId);
            const updatedCharts = [...charts];
            const chartIndex = updatedCharts.findIndex(c => c.id === selectedChart.id);
            
            // Удаляем категорию из labels
            updatedCharts[chartIndex].labels.splice(categoryIndex, 1);
            
            // Удаляем категорию из массива категорий
            if (updatedCharts[chartIndex].categories) {
                updatedCharts[chartIndex].categories.splice(categoryIndex, 1);
            }
            
            // Удаляем соответствующие значения из всех датасетов
            updatedCharts[chartIndex].datasets.forEach(dataset => {
                dataset.data.splice(categoryIndex, 1);
            });
            
            setCharts(updatedCharts);
            setSelectedChart(updatedCharts[chartIndex]);
        } catch (error) {
            console.error("error deleting category: ", error);
        }
    };

    const handleDeleteDataset = async (datasetIndex) => {
        if (!selectedChart) return;
        
        if (!confirm("Удалить этот набор данных?")) return;
        
        const datasetId = selectedChart.datasets[datasetIndex].id;
        
        try {
            await statisticsService.deleteDataset(datasetId);
            
            const updatedCharts = [...charts];
            const chartIndex = updatedCharts.findIndex(c => c.id === selectedChart.id);
            
            updatedCharts[chartIndex].datasets.splice(datasetIndex, 1);
            
            setCharts(updatedCharts);
            setSelectedChart(updatedCharts[chartIndex]);
        } catch (error) {
            console.error("Ошибка удаления набора данных:", error);
        }
    };

    const handleCreateChart = async () => {
        if (!chartMetadata.chart_name.trim()) {
            return;
        }

        try {
            const chartId = await statisticsService.addChart(chartMetadata);
            
            await loadAllCharts();
            
            setChartMetadata({
                chart_name: "",
                chart_type: "bar",
                sort_order: 0
            });
            setShowChartForm(false);
            
        } catch (error) {
            console.error("Ошибка создания графика:", error);
        }
    };

    const handleDeleteChart = async (chartId) => {
        if (!confirm("Удалить этот график?")) return;
        
        try {
            await statisticsService.deleteChart(chartId);
            await loadAllCharts();
            
            if (selectedChart?.id === chartId) {
                setSelectedChart(charts.length > 1 ? charts[1] : null);
            }
        } catch (error) {
            console.error("Ошибка удаления графика:", error);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка данных...</div>;
    }

    return(
        <div className={styles.container}>
            {/* Модальное окно для категории */}
            {showCategoryModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Добавить категорию</h3>
                        <input
                            type="text"
                            placeholder="Название категории"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className={styles.modalInput}
                        />
                        <div className={styles.modalButtons}>
                            <button 
                                onClick={() => setShowCategoryModal(false)}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleAddCategory}
                                className={styles.confirmButton}
                                disabled={!newCategoryName.trim()}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для набора данных */}
            {showDatasetModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Добавить набор данных</h3>
                        <input
                            type="text"
                            placeholder="Название набора данных"
                            value={newDatasetData.label}
                            onChange={(e) => setNewDatasetData({...newDatasetData, label: e.target.value})}
                            className={styles.modalInput}
                        />
                        <div className={styles.colorInputs}>
                            <div className={styles.colorInput}>
                                <label>Цвет фона:</label>
                                <input
                                    type="color"
                                    value={newDatasetData.backgroundColor}
                                    onChange={(e) => setNewDatasetData({...newDatasetData, backgroundColor: e.target.value})}
                                />
                                <span className={styles.colorValue}>{newDatasetData.backgroundColor}</span>
                            </div>
                            <div className={styles.colorInput}>
                                <label>Цвет границы:</label>
                                <input
                                    type="color"
                                    value={newDatasetData.borderColor}
                                    onChange={(e) => setNewDatasetData({...newDatasetData, borderColor: e.target.value})}
                                />
                                <span className={styles.colorValue}>{newDatasetData.borderColor}</span>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <button 
                                onClick={() => setShowDatasetModal(false)}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleAddDataset}
                                className={styles.confirmButton}
                                disabled={!newDatasetData.label.trim()}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.sidebar}>
                <h3> Графики</h3>
                <button 
                    className={styles.addButton}
                    onClick={() => setShowChartForm(!showChartForm)}
                >
                    {showChartForm ? "Отмена" : "+ Новый график"}
                </button>
                {showChartForm && (
                    <div className={styles.chartForm}>
                        <input 
                            type="text"
                            placeholder="Название графика"
                            value={chartMetadata.chart_name}
                            onChange={(e) => setChartMetadata({...chartMetadata, chart_name: e.target.value})} 
                        />
                        {/* <select
                            value={chartMetadata.chart_type}
                            onChange={(e) => setChartMetadata({...chartMetadata, chart_type: e.target.value})}
                        >
                            <option value="bar">Столбчатая</option>
                            <option value="line">Линейная</option>
                            <option value="pie">Круговая</option>
                        </select> */}
                        <input
                            type="number"
                            placeholder="Порядок сортировки"
                            value={chartMetadata.sort_order}
                            onChange={(e) => setChartMetadata({...chartMetadata, sort_order: parseInt(e.target.value) || 0})}
                        />
                        <button onClick={handleCreateChart}>Создать</button>
                    </div>
                )}

                <div className={styles.chartList}>
                    {charts.map(chart => (
                        <div
                            key={chart.id}
                            className={`${styles.chartItem} ${selectedChart?.id === chart.id ? styles.active : ''}`}
                            onClick={() => handleChartSelect(chart.id)}
                        >
                            <span>{chart.chart_name}</span>
                            <button 
                                className={styles.deleteChartButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChart(chart.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={styles.mainContent}>
                {selectedChart ? (
                    <>
                        <div className={styles.tableHeader}>
                            <h2>{selectedChart.chart_name}</h2>
                            <div className={styles.controls}>
                                <button onClick={openCategoryModal}>+ Категория</button>
                                <button onClick={openDatasetModal}>+ Набор данных</button>
                            </div>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.cornerCell}>Категории / Данные</th>
                                        {selectedChart.labels.map((label, index) => (
                                            <th key={index} className={styles.categoryHeader}>
                                                <div className={styles.categoryCell}>
                                                    {label}
                                                    <button 
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDeleteCategory(index)}
                                                        title="Удалить категорию"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedChart.datasets.map((dataset, datasetIndex) => (
                                        <tr key={datasetIndex}>
                                            <td className={styles.datasetHeader}>
                                                <div className={styles.datasetCell}>
                                                    <span 
                                                        className={styles.datasetColor}
                                                        style={{backgroundColor: dataset.backgroundColor}}
                                                    />
                                                    {dataset.label}
                                                    <button 
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDeleteDataset(datasetIndex)}
                                                        title="Удалить набор данных"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </td>
                                            {dataset.data.map((value, categoryIndex) => (
                                                <td
                                                    key={categoryIndex} 
                                                    className={styles.dataCell}
                                                    onClick={() => handleCellClick(datasetIndex, categoryIndex)}
                                                >
                                                    {editingCell?.datasetIndex === datasetIndex && 
                                                    editingCell?.categoryIndex === categoryIndex ? (
                                                        <input
                                                            type="number"
                                                            value={tempValue}
                                                            onChange={handleCellChange}
                                                            onBlur={saveCellValue}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    saveCellValue();
                                                                }
                                                            }}
                                                            autoFocus
                                                            className={styles.editingInput}
                                                        />
                                                    ) : (
                                                        <span className={styles.valueDisplay}>{value}</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className={styles.noChart}>
                        <p>Выберите график из списка или создайте новый</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default AdminStatisticsWindow;