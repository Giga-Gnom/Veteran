class MapService{

    async getAllOrganizationsFromArea(areaId){
        if (window.electronAPI){
            return await window.electronAPI.database.execute(`
                SELECT * FROM area_organizations
                WHERE district_num = ?`,
            [areaId])
        }
        return []
    }

    async deleteOrganization(orgId){
        if (window.electronAPI){
            return await window.electronAPI.database.delete('area_organizations', orgId)
        }
        return false
    }

    async insertOrganization(orgData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('area_organizations', orgData)
        }
        return null
    }
}

export default new MapService();