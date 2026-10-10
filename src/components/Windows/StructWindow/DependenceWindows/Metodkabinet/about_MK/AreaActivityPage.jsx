import { Link } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import styles from "./AreaActivityPage.module.css"

const AreaActivityPage = () => {
return(
    <div className={styles.container}>
        <div className={styles.container_head}>
            <MyHat heading="МЕТОДИЧЕСКИЙ"/>
        </div>

        <div className={styles.container_contant}>
            <div className={styles.contant_column}>
                <div className={styles.column_card}>
                    Нормативно-правовые документы, методические рекомендации , пособия, памятки
                </div>
            </div>
            <div className={styles.contant_column}>
                <div className={styles.column_card}>
                   Партнеры
                </div>
            </div>
            <div className={styles.contant_column}>
                <div className={styles.column_card}>
                    Итоги работы, результаты
                </div>
            </div>
        </div>

        <div className={styles.images}>
            
        </div>
                
        <div className={styles.container_button}>
            <Link to="/metodkabinet">
                <BeforePageButton/>
            </Link>
        </div>
    </div>
)
}

export default AreaActivityPage;