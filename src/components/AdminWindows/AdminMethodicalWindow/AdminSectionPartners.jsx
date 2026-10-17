import { useState } from "react";
import styles from "./AdminSectionPartners.module.css";
import common from "./AdminMethodicalCommon.module.css";
import { ErrorMassage } from "../admin_components/ErrorMassage";
import { showAlert, showConfirm } from "../UI/ConfirmModal/ConfirmModel";

const AdminSectionPartners = ({ section, onChange }) => {
    const [showModal, setShowModal] = useState(false)
    const [editingPartner, setEditingPartner] = useState(null)
    const [partnerName, setPartnerName] = useState("")
    const [error, setError] = useState(null)

    const showError = (message) => setError(message)
    const clearError = () => setError(null)

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

    const handleSave = () => {
        if (!partnerName.trim()) return showError("Введите название партнёра")
        if (editingPartner) {
            onChange({
                ...section,
                partners: section.partners.map(p => p.id === editingPartner.id ? { ...p, name: partnerName.trim() } : p)
            })
            showAlert("Партнёр обновлён")
        } else {
            onChange({
                ...section,
                partners: [...section.partners, { id: Date.now(), name: partnerName.trim() }]
            })
            showAlert("Партнёр добавлен")
        }
        handleCloseModal()
    }

    const handleDelete = async (partner) => {
        const confirmed = await showConfirm(`Удалить партнёра "${partner.name}"?`)
        if (!confirmed) return
        onChange({ ...section, partners: section.partners.filter(p => p.id !== partner.id) })
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

            {section.partners.length === 0 ? (
                <div className={common.empty_state}>
                    <div className={common.icon}>🤝</div>
                    <p>Партнёров пока нет</p>
                    <button className={common.add_first_btn} onClick={handleOpenAdd}>
                        + Добавить первого партнёра
                    </button>
                </div>
            ) : (
                <div className={styles.partners_grid}>
                    {section.partners.map(partner => (
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