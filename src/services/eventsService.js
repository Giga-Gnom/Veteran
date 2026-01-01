class EventsService {
    async getAllSlides(){
        if (window.electronAPI) {
            return await window.electronAPI.database.getAll('slider_images')
        }
        return []
    }

    async addSlide(slideData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('slider_images', slideData)
        }
        return false
    }

    async deleteSlide(slideId){
        if (window.electronAPI){
            return await window.electronAPI.database.delete('slider_images', slideId)
        }
        return null
    }

    async getAllFolders(){
        if (window.electronAPI) {
            return await window.electronAPI.database.getAll('gallery_folders')
        }
        return []
    }

    async addFolder(folderData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('gallery_folders', folderData)
        }
        return false
    }

    async deleteFolder(folderId){
        if (window.electronAPI){
            return await window.electronAPI.database.delete('gallery_folders', folderId)
        }
        return null
    }

    async getAllImagesFormFolder(folderId) {
        if (window.electronAPI){
            try{
                return await window.electronAPI.database.execute(`SELECT * FROM gallery_images
                    WHERE folder_id = ?`,
                [folderId])
            } catch (error) {
                console.error("error fetching images from folder: ", error)
                return []
            }
        }
        return []
    }

    async deleteImage(imageId){
        if(window.electronAPI){
            return await window.electronAPI.database.delete('gallery_images', imageId)
        }
    }

    async addImageIntoFolder(imageData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('gallery_images', imageData)
        }
    }

}

export default new EventsService();