class StandartDocumentService{
    async getAllDocuments(){
        if(window.electronAPI){
            return await window.electronAPI.database.getAll('standart_documents')
        }
        return[]
    }

    async addDocument(documentData){
        if(window.electronAPI){
            return await window.electronAPI.database.insert('standart_documents', documentData)
        }
        return null
    }

    async deleteDocument(id){
        if (!window.electronAPI) return false;
        
        try {
            const documents = await window.electronAPI.database.execute(
                'SELECT id, file_path, file_name FROM standart_documents WHERE id = ?', 
                [id]
            );
            
            if (documents && documents.length > 0) {
                const document = documents[0];
                
                if (document.file_path) {
                    try {
                        await window.electronAPI.file.delete(document.file_path);
                        console.log('Файл документа удален:', document.file_path);
                    } catch (error) {
                        console.error('Ошибка удаления файла документа:', error);
                    }
                }
            }
            
            return await window.electronAPI.database.delete('standart_documents', id);
        } catch (error) {
            console.error('Ошибка в deleteDocument:', error);
            throw error;
        }
    }
}

export default new StandartDocumentService();