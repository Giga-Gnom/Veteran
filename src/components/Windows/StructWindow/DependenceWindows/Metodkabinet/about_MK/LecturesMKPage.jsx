import styles from "./LecturesMKPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import { Link } from "react-router-dom";

const LecturesMKPage = () => {
return(
    <div className={styles.container}>
        <div className={styles.container_head}>
            <MyHat heading="ЛЕКЦИОННЫЙ МАТЕРИАЛ МЕТОДИЧЕСКОГО КАБИНЕТА МГОВ" />
            </div>
        
            <div className={styles.container_contant}>
                
            </div>
        
            <div className={styles.container_button}>
                <Link to="/metodkabinet">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
)
}

export default LecturesMKPage;