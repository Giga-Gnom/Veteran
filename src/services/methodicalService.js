class MethodicalService {
    // ========== Справочники ==========
    async getSections() {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_sections ORDER BY sort_order ASC`,
            []
        );
    }

    async getDocumentTypes() {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_document_types ORDER BY sort_order ASC`,
            []
        );
    }

    async getSectionsWithCounts() {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT s.*,
                (SELECT COUNT(*) FROM methodical_documents d WHERE d.section_id = s.id) AS documents_count,
                (SELECT COUNT(*) FROM methodical_partners p WHERE p.section_id = s.id) AS partners_count,
                (SELECT COUNT(*) FROM methodical_results r WHERE r.section_id = s.id) AS results_count
             FROM methodical_sections s
             ORDER BY s.sort_order ASC`,
            []
        );
    }

    // ========== Документы ==========
    async getDocumentsBySection(sectionId) {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_documents
             WHERE section_id = ?
             ORDER BY created_at DESC`,
            [sectionId]
        );
    }

    async addDocument(data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.insert('methodical_documents', data);
    }

    async updateDocument(id, data) {
        if (!window.electronAPI) return null;
        const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
        return await window.electronAPI.database.execute(
            `UPDATE methodical_documents SET ${sets} WHERE id = ?`,
            [...Object.values(data), id]
        );
    }

    async deleteDocument(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_documents', id);
    }

    // ========== Партнёры ==========
    async getPartnersBySection(sectionId) {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_partners WHERE section_id = ? ORDER BY created_at DESC`,
            [sectionId]
        );
    }

    async addPartner(data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.insert('methodical_partners', data);
    }

    async updatePartner(id, data) {
        if (!window.electronAPI) return null;
        const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
        return await window.electronAPI.database.execute(
            `UPDATE methodical_partners SET ${sets} WHERE id = ?`,
            [...Object.values(data), id]
        );
    }

    async deletePartner(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_partners', id);
    }

    // ========== Итоги ==========
    async getResultsBySection(sectionId) {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_results WHERE section_id = ? ORDER BY created_at DESC`,
            [sectionId]
        );
    }

    async addResult(data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.insert('methodical_results', data);
    }

    async updateResult(id, data) {
        if (!window.electronAPI) return null;
        const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
        return await window.electronAPI.database.execute(
            `UPDATE methodical_results SET ${sets} WHERE id = ?`,
            [...Object.values(data), id]
        );
    }

    async deleteResult(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_results', id);
    }

    // ========== Лекции ==========
    async getLectures() {
        if (!window.electronAPI) return [];
        return await window.electronAPI.database.execute(
            `SELECT * FROM methodical_lectures ORDER BY created_at DESC`,
            []
        );
    }

    async addLecture(data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.insert('methodical_lectures', data);
    }

    async updateLecture(id, data) {
        if (!window.electronAPI) return null;
        const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
        return await window.electronAPI.database.execute(
            `UPDATE methodical_lectures SET ${sets} WHERE id = ?`,
            [...Object.values(data), id]
        );
    }

    async deleteLecture(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_lectures', id);
    }

    // ========== План работы — таблицы ==========
    async getWorkPlans() {
        if (!window.electronAPI) return [];
        const rows = await window.electronAPI.database.execute(
            `SELECT * FROM methodical_work_plans ORDER BY created_at DESC`,
            []
        );
        return rows.map(r => ({
            ...r,
            columns: this._safeParse(r.columns, [])
        }));
    }

    async addWorkPlan(data) {
        if (!window.electronAPI) return null;
        const payload = {
            title: data.title,
            columns: JSON.stringify(data.columns ?? [])
        };
        return await window.electronAPI.database.insert('methodical_work_plans', payload);
    }

    async updateWorkPlan(id, data) {
        if (!window.electronAPI) return null;
        const payload = { ...data };
        if (Array.isArray(payload.columns)) {
            payload.columns = JSON.stringify(payload.columns);
        }
        const sets = Object.keys(payload).map(k => `${k} = ?`).join(', ');
        return await window.electronAPI.database.execute(
            `UPDATE methodical_work_plans SET ${sets} WHERE id = ?`,
            [...Object.values(payload), id]
        );
    }

    async deleteWorkPlan(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_work_plans', id);
    }

    // ========== План работы — строки ==========
    async getPlanRows(planId) {
        if (!window.electronAPI) return [];
        const rows = await window.electronAPI.database.execute(
            `SELECT * FROM methodical_work_plan_rows WHERE plan_id = ? ORDER BY id ASC`,
            [planId]
        );
        return rows.map(r => ({ ...r, data: this._safeParse(r.data, {}) }));
    }

    async addPlanRow(planId, data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.insert('methodical_work_plan_rows', {
            plan_id: planId,
            data: JSON.stringify(data ?? {})
        });
    }

    async updatePlanRow(id, data) {
        if (!window.electronAPI) return null;
        return await window.electronAPI.database.execute(
            `UPDATE methodical_work_plan_rows SET data = ? WHERE id = ?`,
            [JSON.stringify(data ?? {}), id]
        );
    }

    async deletePlanRow(id) {
        if (!window.electronAPI) return false;
        return await window.electronAPI.database.delete('methodical_work_plan_rows', id);
    }

    // ========== Утилиты ==========
    _safeParse(str, fallback) {
        if (str === null || str === undefined) return fallback;
        if (typeof str !== 'string') return str;
        try { return JSON.parse(str); } catch { return fallback; }
    }

    // ========== Хелпер для файлов ==========
    async saveFileFromInput(file) {
        if (!window.electronAPI || !file) return null;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        return await window.electronAPI.file.save(file.name, buffer);
    }

    async getWorkPlanById(id) {
        if (!window.electronAPI) return null;
        const rows = await window.electronAPI.database.execute(
            `SELECT * FROM methodical_work_plans WHERE id = ?`,
            [id]
        );
        if (!rows[0]) return null;
        
        const plan = rows[0];
        return {
            ...plan,
            columns: this._safeParse(plan.columns, [])
        };
    }
}

export default new MethodicalService();