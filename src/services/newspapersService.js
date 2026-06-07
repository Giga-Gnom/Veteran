class NewspapersService {

    async addNewspaper(newspaperData) {
        if (window.electronAPI) {
            return await window.electronAPI.database.insert('newspapers', newspaperData)
        }
        return null
    }

    async deleteNewspaper(id) {
        if (!window.electronAPI) return false;
        
        try {
            const newspapers = await window.electronAPI.database.execute(
                'SELECT id, file_path, file_name FROM newspapers WHERE id = ?', 
                [id]
            );
            
            if (newspapers && newspapers.length > 0) {
                const newspaper = newspapers[0];
                
                if (newspaper.file_path) {
                    try {
                        await window.electronAPI.file.delete(newspaper.file_path);
                        console.log('Файл газеты удален:', newspaper.file_path);
                    } catch (error) {
                        console.error('Ошибка удаления файла газеты:', error);
                    }
                }
            }
            
            return await window.electronAPI.database.delete('newspapers', id);
        } catch (error) {
            console.error('Ошибка в deleteNewspaper:', error);
            throw error;
        }
    }

    async getAllYearsWithQuarters() {
        if(window.electronAPI) {
            try {
                const years = await window.electronAPI.database.execute(`SELECT * FROM newspapers_years ORDER BY year DESC`);
                
                const yearWithData = await Promise.all(years.map(async (year) => {
                    const quarters = await window.electronAPI.database.execute(`SELECT q.*, COUNT(n.id) as newspaper_count
                        FROM newspapers_quarters AS q
                        LEFT JOIN newspapers n ON n.quarter_id = q.id
                        WHERE year_id = ?
                        GROUP BY q.id
                        ORDER BY q.quarter ASC`,
                        [year.id]
                    );

                    const totalNewspapers = quarters.reduce((sum, q) => sum + (q.newspaper_count || 0), 0);

                    return {
                        ...year,
                        quarters: quarters.map(q => ({
                            ...q,
                            title: q.title || `${q.quarter} квартал`,
                            newspaper_count: q.newspaper_count || 0,
                        })),
                        newspaper_count: totalNewspapers
                    }
                }))
                return yearWithData;
            } catch (error) {
                console.error("error fetching years with quarters: ", error)
                return []
            }
        }
        return []
    }

    async getQuartersByYear (yearID) {
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.execute(`SELECT q.*, COUNT(n.id) as newspaper_count
                        FROM newspapers_quarters AS q
                        LEFT JOIN newspapers n ON n.quarter_id = q.id
                        WHERE year_id = ?
                        GROUP BY q.id
                        ORDER BY q.quarter ASC`,
                        [yearID]
                    )
            } catch (error) {
                console.error("error fetching quarters ", error)
                return []
            }
        }
        return []
    }

    async getNewsPapersByQuarter(quarterID){
        if (window.electronAPI) {
            try {
                return await window.electronAPI.database.execute(`SELECT * FROM newspapers
                    WHERE quarter_id = ?
                    ORDER BY issue_date DESC`,[quarterID])
            } catch (error) {
                console.error("error fetching newspaper by quarter ", error)
                return []
            }
        }
        return []
    }

    async getAllNewspapers(){
        if(window.electronAPI){
            try{
                return await window.electronAPI.database.execute(`
                    SELECT n.*, y.year, q.quarter
                    FROM newspapers n
                    LEFT JOIN newspapers_quarters q ON n.quarter_id = q.id
                    LEFT JOIN newspapers_years y ON q.year_id = y.id
                    ORDER BY y.year DESC, q.quarter ASC, n.issue_date DESC
                    `, []
                )
            } catch (error) {
                console.error("error fetching all newspapers ", error)
                return []
            }
        }
        return []
    }

    async addQuarter(quarterData) {
        if(window.electronAPI) {
            return await window.electronAPI.database.insert('newspapers_quarters', quarterData)
        }
        return null
    }

    async deleteQuarter(quarter_id) {
        if (!window.electronAPI) return false;
        
        try {
            const newspapers = await this.getNewsPapersByQuarter(quarter_id);
            
            if (newspapers && newspapers.length > 0) {
                for (const newspaper of newspapers) {
                    if (newspaper.file_path) {
                        try {
                            await window.electronAPI.file.delete(newspaper.file_path);
                            console.log('Файл газеты удален:', newspaper.file_path);
                        } catch (error) {
                            console.error('Ошибка удаления файла газеты:', error);
                        }
                    }
                }
            }
            
            return await window.electronAPI.database.delete('newspapers_quarters', quarter_id);
        } catch (error) {
            console.error('Ошибка в deleteQuarter:', error);
            throw error;
        }
    }

    async deleteYear(year_id) {
        if (!window.electronAPI) return false;
        
        try {
            const quarters = await this.getQuartersByYear(year_id);
            
            for (const quarter of quarters) {
                const newspapers = await this.getNewsPapersByQuarter(quarter.id);
                for (const newspaper of newspapers) {
                    if (newspaper.file_path) {
                        try {
                            await window.electronAPI.file.delete(newspaper.file_path);
                            console.log('Файл газеты удален:', newspaper.file_path);
                        } catch (error) {
                            console.error('Ошибка удаления файла газеты:', error);
                        }
                    }
                }
            }
            
            return await window.electronAPI.database.delete('newspapers_years', year_id);
        } catch (error) {
            console.error('Ошибка в deleteYear:', error);
            throw error;
        }
    }

    async addYear(yearData) {
        if(window.electronAPI) {
            return await window.electronAPI.database.insert('newspapers_years', yearData)
        }
        return null
    }
}

export default new NewspapersService();