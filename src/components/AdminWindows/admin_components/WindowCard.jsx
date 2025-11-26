import { Link } from "react-router-dom"
import styles from "./AdminComponents.module.css"

const WindowCard = ({name, path}) => {

    return(
        <Link to={path} className={styles.windowCard_container} >
            {name}
        </Link>
    )
}

export default WindowCard