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
    const [partnerName, setPartnerName] = useState("")
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

    const handleOpenAdd = () => {
        setEditingPartner(null)
        setPartnerName("")
        setShowModal(true)
    }

    const handleOpenEdit = (partner) => {
        setEditingPartner(partner)
        setPartnerName(partner.name)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setEditingPartner(null)
        setPartnerName("")
        setShowModal(false)
    }

    const handleSave = async () => {
        if (!partnerName.trim()) return showError("Введите название партнёра")
        try {
            if (editingPartner) {
                await methodicalService.updatePartner(editingPartner.id, { name: partnerName.trim() })
                showAlert("Партнёр обновлён")
            } else {
                await methodicalService.addPartner({
                    section_id: sectionId,
                    name: partnerName.trim()
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
                    {partners.map(partner => (
                        <div key={partner.id} className={styles.partner_card}>
                            <h4 className={styles.partner_name}>{partner.name}</h4>
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