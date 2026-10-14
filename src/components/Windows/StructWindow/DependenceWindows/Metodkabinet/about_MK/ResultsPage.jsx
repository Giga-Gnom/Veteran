import { Link } from "react-router-dom";
import styles from "./ResultsPage.module.css"
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";

const ResultsPage = () => {
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

export default ResultsPage;