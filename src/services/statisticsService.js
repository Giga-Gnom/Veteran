class StatisticService{

    async getAllCharts(){
        if(window.electronAPI){
            return await window.electronAPI.database.execute(
                `SELECT * FROM statistic_charts
                ORDER BY sort_order ASC, created_at DESC`,
                []
            )
        }
    }

    // Добавьте в StatisticService
    async getDataPointsForDataset(datasetId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.execute(
                    `SELECT * FROM chart_data_points WHERE dataset_id = ?`,
                    [datasetId]
                );
            } catch (error) {
                console.error("Error fetching data points:", error);
                return [];
            }
        }
        return [];
    }

    async getChartCategories(chartId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.execute(
                    `SELECT * FROM chart_categories 
                    WHERE chart_id = ? 
                    ORDER BY sort_order ASC`,
                    [chartId]
                );
            } catch (error) {
                console.error("Error fetching chart categories:", error);
                return [];
            }
        }
        return [];
    }

    async getFullChartData(chartId){
        if (window.electronAPI){
            try{
                const chart = await window.electronAPI.database.execute(
                    `SELECT * FROM statistic_charts WHERE id = ?`,
                    [chartId]
                )

                if (!chart[0]) return null

                const categories = await window.electronAPI.database.execute(
                    `SELECT * FROM chart_categories
                     WHERE chart_id = ?
                     ORDER BY sort_order ASC`,
                     [chartId]
                )

                const datasets = await window.electronAPI.database.execute(
                    `SELECT * FROM chart_datasets 
                     WHERE chart_id = ? 
                     ORDER BY sort_order ASC`,
                     [chartId]
                )

                const fullDatasets = await Promise.all(
                    datasets.map(async (dataset) => {
                        const dataPoints = await window.electronAPI.database.execute(
                            `SELECT cd.*, cc.category_name 
                             FROM chart_data_points cd
                             JOIN chart_categories cc ON cd.category_id = cc.id
                             WHERE cd.dataset_id = ?
                             ORDER BY cc.sort_order ASC`,
                             [dataset.id]
                        )

                        const data = categories.map(category => {
                            const point = dataPoints.find(p => p.category_id === category.id);
                            return point ? parseFloat(point.data_value) : 0;
                        });

                        return {
                            ...dataset,
                            data: data
                        };
                    })
                )

                return {
                    ...chart[0],
                    labels: categories.map(c => c.category_name),
                    datasets: fullDatasets.map(ds => ({
                        label: ds.dataset_label,
                        data: ds.data,
                        backgroundColor: ds.dataset_color,
                        borderColor: ds.border_color,
                        borderWidth: 1
                    }))
                }
            } catch (error) {
                console.error("Error fetching full chart data:", error);
                return null;
            }
        }
    }

    async getAllFullCharts() {
        const charts = await this.getAllCharts();
        const fullCharts = await Promise.all(
            charts.map(chart => this.getFullChartData(chart.id))
        );
        return fullCharts.filter(chart => chart !== null);
    }


    async addChart(chartData) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.insert('statistic_charts', chartData);
            } catch (error) {
                console.error("Error adding chart:", error);
                throw error;
            }
        }
        return null;
    }

    async updateChart(chartId, chartData) {
        if (window.electronAPI) {
            try {
                const sets = Object.keys(chartData).map(key => `${key} = ?`).join(', ');
                const values = [...Object.values(chartData), chartId];
                
                return await window.electronAPI.database.execute(
                    `UPDATE statistic_charts SET ${sets} WHERE id = ?`,
                    values
                );
            } catch (error) {
                console.error("Error updating chart:", error);
                throw error;
            }
        }
        return null;
    }

    async deleteChart(chartId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.delete('statistic_charts', chartId);
            } catch (error) {
                console.error("Error deleting chart:", error);
                throw error;
            }
        }
        return false;
    }

    async addCategory(chartId, categoryData){
        if (window.electronAPI){
            try{
                const dataWithChartId = {
                    ...categoryData,
                    chart_id: chartId
                }
                return await window.electronAPI.database.insert('chart_categories', dataWithChartId)
            } catch (error) {
                console.error("Error adding category:", error);
                throw error;
            }
        }
        return null
    }

    async updateCategory(categoryId, categoryData){
        if(window.electronAPI){
            try{
                const sets = Object.keys(categoryData).map(key => `${key} = ?`).join(', ')
                const values = [...Object.values(categoryData), categoryId]

                return await window.electronAPI.database.execute(
                    `UPDATE chart_categories SET ${sets} WHERE id = ?`,
                    values
                );
            } catch (error) {
                console.error("Error updating category:", error);
                throw error;
            }
        }
        return null
    }

    async deleteCategory(categoryId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.delete('chart_categories', categoryId);
            } catch (error) {
                console.error("Error deleting category:", error);
                throw error;
            }
        }
        return false;
    }

    async addDataset(chartId, datasetData) {
        if (window.electronAPI) {
            try {
                const dataWithChartId = {
                    ...datasetData,
                    chart_id: chartId
                };
                return await window.electronAPI.database.insert('chart_datasets', dataWithChartId);
            } catch (error) {
                console.error("Error adding dataset:", error);
                throw error;
            }
        }
        return null;
    }

    async updateDataset(datasetId, datasetData) {
        if (window.electronAPI) {
            try {
                const sets = Object.keys(datasetData).map(key => `${key} = ?`).join(', ');
                const values = [...Object.values(datasetData), datasetId];
                
                return await window.electronAPI.database.execute(
                    `UPDATE chart_datasets SET ${sets} WHERE id = ?`,
                    values
                );
            } catch (error) {
                console.error("Error updating dataset:", error);
                throw error;
            }
        }
        return null;
    }

    async deleteDataset(datasetId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.delete('chart_datasets', datasetId);
            } catch (error) {
                console.error("Error deleting dataset:", error);
                throw error;
            }
        }
        return false;
    }


    async addDataPoint(datasetId, categoryId, value) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.insert('chart_data_points', {
                    dataset_id: datasetId,
                    category_id: categoryId,
                    data_value: value
                });
            } catch (error) {
                console.error("Error adding data point:", error);
                throw error;
            }
        }
        return null;
    }

    async updateDataPoint(dataPointId, value) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.execute(
                    `UPDATE chart_data_points SET data_value = ? WHERE id = ?`,
                    [value, dataPointId]
                );
            } catch (error) {
                console.error("Error updating data point:", error);
                throw error;
            }
        }
        return null;
    }

    async deleteDataPoint(dataPointId) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.delete('chart_data_points', dataPointId);
            } catch (error) {
                console.error("Error deleting data point:", error);
                throw error;
            }
        }
        return false;
    }


    async createCompleteChart(chartConfig) {
        const { chartData, categories, datasets } = chartConfig;
        
        const chartId = await this.addChart(chartData);
        const categoryIds = [];
        for (let i = 0; i < categories.length; i++) {
            const categoryId = await this.addCategory(chartId, {
                category_name: categories[i],
                sort_order: i
            });
            categoryIds.push(categoryId);
        }
        
        for (let i = 0; i < datasets.length; i++) {
            const dataset = datasets[i];
            const datasetId = await this.addDataset(chartId, {
                dataset_label: dataset.label,
                dataset_color: dataset.backgroundColor,
                border_color: dataset.borderColor,
                sort_order: i
            });
            
            for (let j = 0; j < dataset.data.length; j++) {
                await this.addDataPoint(datasetId, categoryIds[j], dataset.data[j]);
            }
        }
        
        return chartId;
    }
}

export default new StatisticService();