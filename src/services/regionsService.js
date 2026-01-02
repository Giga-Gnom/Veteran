class RegionsService{

    async getAllRegions(){
        if(window.electronAPI){
            return await window.electronAPI.database.getAll('regions')
        }
        return []
    }

    async addRegion(regionData) {
        if(window.electronAPI){
            return await window.electronAPI.database.insert('regions', regionData)
        }
        return null
    }

    async deleteRegion(regionId) {
        if(window.electronAPI){
            return await window.electronAPI.database.delete('regions', regionId)
        }
        return false
    }

}

export default new RegionsService();