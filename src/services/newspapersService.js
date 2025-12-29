class NewspapersService {

    // async getAllNewspapers (){
    //     if (window.electronAPI) {
    //         return await window.electronAPI.database.getAll('newspappers')
    //     }
    //     return []
    // }

    async addNewspaper(newspaperDate) {
        if (window.electronAPI) {
            return await window.electronAPI.database.insert('newspapers', newspaperDate)
        }
        return null
    }

    async deleteNewspaper(id) {
        if (window.electronAPI) {
            return await window.electronAPI.database.delete('newspapers', id)
        }
        return false
    }

    async getAllYearsWithQuarters() {
        if(window.electronAPI) {
            try {
                const years = await window.electronAPI.database.execute(`SELECT * FROM newspapers_years ORDER BY year DESC`);
                
                const yearWithData = await Promise.all(years.map(async (year) => {
                    const quarter = await window.electronAPI.database.execute(`SELECT q.*, COUNT(n.id) as newspaper_count
                        FROM newspapers_quarters AS q
                        LEFT JOIN newspapers n ON n.quarter_id = q.id
                        WHERE year_id = ?
                        GROUP BY q.id
                        ORDER BY q.quarter ASC`,
                        [year.id]
                    );

                    const totalNewspapers = quarter.reduce((sum, q) => sum + (q.newspaper_count || 0), 0);

                    return {
                        ...year,
                        quarters: quarter.map(q => ({
                            ...q,
                            title: q.title || `${q.quarter} квартал`,
                            newspaper_count: q.newspaper_count || 0,
                        })),
                        newspaper_count: totalNewspapers
                    }
                }))
                return yearWithData;
            } catch (error) {
                console.error("error fetching ears with quarters: ", error)
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
        if (window.electronAPI) {
            return await window.electronAPI.database.delete('newspapers_quarters', quarter_id)
        }
        return false
    }

    async deleteYear(year_id) {
        if(window.electronAPI){
            return window.electronAPI.database.delete('newspapers_years', year_id)
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