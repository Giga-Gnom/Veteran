import { Link, useParams } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import styles from "./AreaActivityPage.module.css"

const AreaActivityPage = () => {

    const {id} = useParams();

    
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ"/>
            </div>

            <div className={styles.container_contant}>
                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/documnets`}
                        className={styles.column_card}
                    >
                        Нормативно-правовые документы, методические рекомендации, пособия, памятки
                    </Link>
                </div>

                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/partners`}
                        className={styles.column_card}
                    >
                        Партнёры
                    </Link>
                </div>

                <div className={styles.contant_column}>
                    <Link
                        to={`/metodkabinet/activity/${id}/results`}
                        className={styles.column_card}
                    >
                        Итоги работы, результаты
                    </Link>
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