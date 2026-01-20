
import { useState } from "react";
import styles from "./AdminComponents.module.css"

export const ErrorMassage = ({message, onClose}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose();
    }

    if (!isVisible) return null

    return(
        <div className={styles.errorMessage_container}>
            <div className={styles.errorMeassage_container_close} onClick={handleClose}>
                x
            </div>
            <div className={styles.errorMessage_container_message}>
                {message}
            </div>
        </div>
    )
}
