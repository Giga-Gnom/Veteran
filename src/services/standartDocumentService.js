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
        if(window.electronAPI){
            return await window.electronAPI.database.delete('standart_documents', id)
        }
        return false
    }
}

export default new StandartDocumentService();