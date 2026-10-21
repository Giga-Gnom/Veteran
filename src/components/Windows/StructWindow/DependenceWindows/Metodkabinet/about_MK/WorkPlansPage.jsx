import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./WorkPlansPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import methodicalService from "../../../../../../services/methodicalService";

const WorkPlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await methodicalService.getWorkPlans();
                setPlans(data);
            } catch (err) {
                console.error("Ошибка загрузки планов:", err);
                setError("Не удалось загрузить планы");
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="ПЛАН РАБОТЫ" />
            </div>

            <div className={styles.container_contant}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : plans.length === 0 ? (
                    <div className={styles.status}>Таблиц плана пока нет</div>
                ) : (
                    plans.map((plan) => (
                        <Link 
                            to={`/metodkabinet/plans/${plan.id}`} 
                            className={styles.column_card} 
                            key={plan.id}
                        >
                            <span className={styles.plan_title}>{plan.title}</span>
                        </Link>
                    ))
                )}
            </div>

            <div className={styles.container_button}>
                <Link to="/metodkabinet">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default WorkPlansPage;