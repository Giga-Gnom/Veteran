import { Link } from "react-router-dom"
import styles from "./AdminComponents.module.css"

const WindowCard = ({name, path, isActive = false, onClick}) => {

    return(
        <Link to={path} 
        className={`${styles.windowCard_container} ${isActive ? styles.active : ""}`}
        onClick={onClick} >
            {name}
        </Link>
    )
}

export default WindowCard