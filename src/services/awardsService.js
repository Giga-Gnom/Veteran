class AwardsService {
    async getAllAwards () {
        if (window.electronAPI) {
            return await window.electronAPI.database.getAll('awards')
        }
        return []
    }

    async addAward (awardData) {
        if (window.electronAPI) {
            return await window.electronAPI.database.insert('awards', awardData)
        }
        return null
    }

    async deleteAward (awardId) {
        if (window.electronAPI) {
            await window.electronAPI.database.delete('awards', awardId)
        }
        return false
    }
}

export default new AwardsService();