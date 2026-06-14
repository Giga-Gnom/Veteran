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
        if (!window.electronAPI) return false;
        
        try {
            const slides = await window.electronAPI.database.execute(
                'SELECT id, image_path FROM slider_images WHERE id = ?', 
                [slideId]
            );
            
            if (slides && slides.length > 0) {
                const slide = slides[0];
                
                if (slide.image_path) {
                    try {
                        await window.electronAPI.file.delete(slide.image_path);
                        console.log('Изображение слайда удалено:', slide.image_path);
                    } catch (error) {
                        console.error('Ошибка удаления изображения слайда:', error);
                    }
                }
            }
            
            return await window.electronAPI.database.delete('slider_images', slideId);
        } catch (error) {
            console.error('Ошибка в deleteSlide:', error);
            throw error;
        }
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
        if (!window.electronAPI) return false;
        
        try {
            const images = await this.getAllImagesFormFolder(folderId);
            
            if (images && images.length > 0) {
                for (const image of images) {
                    if (image.image_path) {
                        try {
                            await window.electronAPI.file.delete(image.image_path);
                            console.log('Изображение удалено:', image.image_path);
                        } catch (error) {
                            console.error('Ошибка удаления изображения:', error);
                        }
                    }
                }
            }
            
            return await window.electronAPI.database.delete('gallery_folders', folderId);
        } catch (error) {
            console.error('Ошибка в deleteFolder:', error);
            throw error;
        }
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

    async getFirstImageFormFolder(folderId){
        if(window.electronAPI){
            const result = await window.electronAPI.database.execute(`SELECT image_path from gallery_images
                WHERE folder_id = ?
                LIMIT 1`, [folderId])
            return result && result.length > 0 ? result : []  // возвращаем массив
        }
        return []
    }

    async deleteImage(imageId){
        if (!window.electronAPI) return false;
        
        try {
            const images = await window.electronAPI.database.execute(
                'SELECT id, image_path FROM gallery_images WHERE id = ?', 
                [imageId]
            );
            
            if (images && images.length > 0) {
                const image = images[0];
                
                if (image.image_path) {
                    try {
                        await window.electronAPI.file.delete(image.image_path);
                        console.log('Изображение удалено:', image.image_path);
                    } catch (error) {
                        console.error('Ошибка удаления изображения:', error);
                    }
                }
            }
            
            return await window.electronAPI.database.delete('gallery_images', imageId);
        } catch (error) {
            console.error('Ошибка в deleteImage:', error);
            throw error;
        }
    }

    async addImageIntoFolder(imageData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('gallery_images', imageData)
        }
        return null
    }
}

export default new EventsService();