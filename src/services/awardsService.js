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
        if (!window.electronAPI) return false;

        try {
            const awards = await window.electronAPI.database.execute(
                'SELECT id, file_path, image_path FROM awards WHERE id = ?', 
                [awardId]
            );

            if (awards && awards.length > 0) {
                const award = awards[0];

                if (award.file_path) {
                    try {
                        await window.electronAPI.file.delete(award.file_path);
                        console.log('Документ удален:', award.file_path);
                    } catch (error) {
                        console.error('Ошибка удаления документа:', error);
                    }
                }

                if (award.image_path) {
                    try {
                        await window.electronAPI.file.delete(award.image_path);
                        console.log("Изображение удалено:", award.image_path);
                    } catch (error) {
                        console.error('Ошибка удаления изображения:', error);
                    }
                }
            }

            await window.electronAPI.database.delete('awards', awardId);
            return true;

        } catch (error) {
            console.error('Ошибка в deleteAward:', error);
            throw error;
        }
    }
}

export default new AwardsService();