// components/admin_components/ConfirmModal.jsx
import { useState, useEffect } from "react"
import styles from "./ConfirmModal.module.css"

let modalResolve = null

export const showConfirm = (message) => {
    return new Promise((resolve) => {
        modalResolve = resolve
        window.dispatchEvent(new CustomEvent('showConfirmModal', { detail: { message } }))
    })
}

export const showAlert = (message) => {
    return new Promise((resolve) => {
        modalResolve = resolve
        window.dispatchEvent(new CustomEvent('showAlertModal', { detail: { message } }))
    })
}

const ConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("confirm") // confirm или alert

    useEffect(() => {
        const handleShowConfirm = (e) => {
            setMessage(e.detail.message)
            setType("confirm")
            setIsOpen(true)
        }

        const handleShowAlert = (e) => {
            setMessage(e.detail.message)
            setType("alert")
            setIsOpen(true)
        }

        window.addEventListener('showConfirmModal', handleShowConfirm)
        window.addEventListener('showAlertModal', handleShowAlert)

        return () => {
            window.removeEventListener('showConfirmModal', handleShowConfirm)
            window.removeEventListener('showAlertModal', handleShowAlert)
        }
    }, [])

    const handleConfirm = () => {
        setIsOpen(false)
        if (modalResolve) {
            modalResolve(true)
            modalResolve = null
        }
    }

    const handleCancel = () => {
        setIsOpen(false)
        if (modalResolve) {
            modalResolve(false)
            modalResolve = null
        }
    }

    if (!isOpen) return null

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal_container}>
                <div className={styles.modal_icon}>
                    {type === "confirm" ? "❓" : "ℹ️"}
                </div>
                <p className={styles.modal_message}>{message}</p>
                <div className={styles.modal_buttons}>
                    {type === "confirm" ? (
                        <>
                            <button 
                                className={`${styles.modal_btn} ${styles.cancel_btn}`}
                                onClick={handleCancel}
                            >
                                Отмена
                            </button>
                            <button 
                                className={`${styles.modal_btn} ${styles.confirm_btn}`}
                                onClick={handleConfirm}
                            >
                                Подтвердить
                            </button>
                        </>
                    ) : (
                        <button 
                            className={`${styles.modal_btn} ${styles.ok_btn}`}
                            onClick={handleConfirm}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal