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
        if (!window.electronAPI) return false;
        
        try {
            const regions = await window.electronAPI.database.execute(
                'SELECT id, document_path, logo_path FROM regions WHERE id = ?', 
                [regionId]
            );
            
            if (regions && regions.length > 0) {
                const region = regions[0];
                
                if (region.document_path) {
                    try {
                        await window.electronAPI.file.delete(region.document_path);
                        console.log('Документ региона удален:', region.document_path);
                    } catch (error) {
                        console.error('Ошибка удаления документа региона:', error);
                    }
                }
                
                if (region.logo_path) {
                    try {
                        await window.electronAPI.file.delete(region.logo_path);
                        console.log('Логотип региона удален:', region.logo_path);
                    } catch (error) {
                        console.error('Ошибка удаления логотипа региона:', error);
                    }
                }
            }
            
            return await window.electronAPI.database.delete('regions', regionId);
        } catch (error) {
            console.error('Ошибка в deleteRegion:', error);
            throw error;
        }
    }
}

export default new RegionsService();