import styles from "./ActivityPage.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link } from "react-router-dom";

const ActivityPartners = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ" />
            </div>

            <div className={styles.container_contant}>
               
            </div>

            <div className={styles.container_button}>
                <Link to="/metodkabinet/activity/1">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    )
}

export default ActivityPartners;