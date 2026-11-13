import { useEffect, useState } from "react";
import styles from "./AdminSectionPartners.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";
import methodicalService from "../../../services/methodicalService";

const AdminSectionPartners = ({ sectionId, onChanged }) => {
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingPartner, setEditingPartner] = useState(null)
    
    // Состояния формы
    const [partnerName, setPartnerName] = useState("")
    const [partnerUrl, setPartnerUrl] = useState("") 
    
    const [error, setError] = useState(null)

    const showError = (m) => setError(m)
    const clearError = () => setError(null)

    useEffect(() => { loadPartners() }, [sectionId])

    const loadPartners = async () => {
        try {
            setLoading(true)
            setPartners(await methodicalService.getPartnersBySection(sectionId))
        } catch (e) {
            console.error(e)
            showError("Не удалось загрузить партнёров")
        } finally {
            setLoading(false)
        }
    }

    // ========== ПЕРЕМЕЩЕНИЕ СТРЕЛОЧКАМИ ==========
    const handleMoveUp = async (index) => {
        if (index === 0) return; 
        const newPartners = [...partners];
        [newPartners[index - 1], newPartners[index]] = [newPartners[index], newPartners[index - 1]];
        setPartners(newPartners);
        try {
            const orderedIds = newPartners.map(p => p.id);
            await methodicalService.updatePartnerOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }

    const handleMoveDown = async (index) => {
        if (index === partners.length - 1) return; 
        const newPartners = [...partners];
        [newPartners[index + 1], newPartners[index]] = [newPartners[index], newPartners[index + 1]];
        setPartners(newPartners);
        try {
            const orderedIds = newPartners.map(p => p.id);
            await methodicalService.updatePartnerOrder(orderedIds);
        } catch (e) {
            console.error(e);
            showError("Ошибка при сохранении порядка");
        }
    }
    // ===========================================

    const handleOpenAdd = () => {
        setEditingPartner(null)
        setPartnerName("")
        setPartnerUrl("")
        setShowModal(true)
    }

    const handleOpenEdit = (partner) => {
        setEditingPartner(partner)
        setPartnerName(partner.name)
        setPartnerUrl(partner.external_url ?? "")
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setEditingPartner(null)
        setPartnerName("")
        setPartnerUrl("")
        setShowModal(false)
    }

    const handleSave = async () => {
        if (!partnerName.trim()) return showError("Введите название партнёра")
        try {
            const payload = {
                name: partnerName.trim(),
                external_url: partnerUrl.trim() || null
            }

            if (editingPartner) {
                await methodicalService.updatePartner(editingPartner.id, payload)
                showAlert("Партнёр обновлён")
            } else {
                await methodicalService.addPartner({
                    section_id: sectionId,
                    ...payload
                })
                showAlert("Партнёр добавлен")
            }
            handleCloseModal()
            await loadPartners()
            onChanged?.()
        } catch (e) {
            console.error(e)
            showError("Ошибка при сохранении")
        }
    }

    const handleDelete = async (partner) => {
        const confirmed = await showConfirm(`Удалить партнёра "${partner.name}"?`)
        if (!confirmed) return
        try {
            await methodicalService.deletePartner(partner.id)
            await loadPartners()
            onChanged?.()
            showAlert("Партнёр удалён")
        } catch (e) {
            console.error(e)
            showError("Ошибка при удалении")
        }
    }

    return (
        <div>
            {error && <ErrorMassage message={error} onClose={clearError}/>}

            <div className={common.section_header}>
                <h3 className={common.section_title}>Партнёры</h3>
                <button className={common.add_btn} onClick={handleOpenAdd}>
                    + Добавить партнёра
                </button>
            </div>

            {loading ? (
                <div className={common.empty_state}><p>Загрузка...</p></div>
            ) : partners.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>🤝</div>
                    <p>Партнёров пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первого партнёра
                    </button>
                </div>
            ) : (
                <div className={styles.partners_grid}>
                    {partners.map((partner, index) => (
                        <div key={partner.id} className={styles.partner_card}>
                            
                            <div className={styles.card_top_row}>
                                <div>
                                    <h4 className={styles.partner_name}>{partner.name}</h4>
                                    {partner.external_url && (
                                        <span style={{fontSize: '0.9vw', color: '#007aff', display: 'block', marginTop: '0.5vh'}}>🔗 Сайт прикреплен</span>
                                    )}
                                </div>
                                
                                <div className={styles.sort_controls}>
                                    <button className={styles.sort_btn} onClick={() => handleMoveUp(index)} disabled={index === 0}>⬆️</button>
                                    <button className={styles.sort_btn} onClick={() => handleMoveDown(index)} disabled={index === partners.length - 1}>⬇️</button>
                                </div>
                            </div>

                            <div className={styles.partner_actions}>
                                <button className={common.view_btn} onClick={() => handleOpenEdit(partner)}>Изменить</button>
                                <button className={common.delete_btn} onClick={() => handleDelete(partner)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={common.modal_overlay} onClick={handleCloseModal}>
                    <div className={common.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{editingPartner ? "Редактировать партнёра" : "Новый партнёр"}</h3>
                        
                        <div className={common.form_group}>
                            <label htmlFor="partnerName">Название организации *</label>
                            <input
                                id="partnerName"
                                type="text"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Например: Городской совет ветеранов"
                                autoFocus
                            />
                        </div>

                        <div className={common.form_group}>
                            <label htmlFor="partnerUrl">Ссылка на сайт (необязательно)</label>
                            <input
                                id="partnerUrl"
                                type="url"
                                value={partnerUrl}
                                onChange={(e) => setPartnerUrl(e.target.value)}
                                placeholder="https://..."
                            />
                            <small className={common.hint}>При клике на карточку у клиента откроется этот сайт</small>
                        </div>

                        <div className={common.modal_actions}>
                            <button className={common.cancel_btn} onClick={handleCloseModal}>Отмена</button>
                            <button className={common.submit_btn} onClick={handleSave}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSectionPartners