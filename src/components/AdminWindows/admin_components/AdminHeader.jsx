import { Link, useLocation } from "react-router-dom";
import styles from "./AdminComponents.module.css"

const AdminHeader = () => {

    const location = useLocation();
  
    const handleClose = () => {
    if (window.electronAPI) {
      window.close();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };
  
    return(
    <header className={styles.adminHeader}>
        <div className={styles.adminHeader_contant}>
            <h1>Панель управления киоском</h1>
            <div className={styles.close_button_container}>
                <button onClick={handleClose} className={styles.close_button}>
                    Закрыть админ панель
                </button>
            </div>
        </div>
    </header>
    )
}

export default AdminHeader