import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./WorkPlanViewPage.module.css";
import MyHat from "../../../../../Hat/MyHat";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import methodicalService from "../../../../../../services/methodicalService";

const WorkPlanViewPage = () => {
    const { id } = useParams();
    
    const [plan, setPlan] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const planData = await methodicalService.getWorkPlanById(id);
                if (!planData) {
                    setError("Таблица не найдена");
                    return;
                }
                setPlan(planData);
                
                const rowsData = await methodicalService.getPlanRows(id);
                setRows(rowsData);
            } catch (err) {
                console.error("Ошибка загрузки таблицы:", err);
                setError("Не удалось загрузить таблицу");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    const renderCell = (value, colType) => {
        if (value === null || value === undefined || value === "") {
            return "—";
        }
        if (colType === "boolean") {
            return value ? "Да" : "Нет";
        }
        return String(value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={plan ? plan.title.toUpperCase() : "ПЛАН РАБОТЫ"} />
            </div>

            <div className={styles.table_wrapper}>
                {loading ? (
                    <div className={styles.status}>Загрузка...</div>
                ) : error ? (
                    <div className={styles.status} style={{ color: 'red' }}>{error}</div>
                ) : plan ? (
                    plan.columns.length === 0 ? (
                        <div className={styles.status}>В этой таблице нет колонок</div>
                    ) : (
                        <div className={styles.table_scroll}>
                            <table className={styles.view_table}>
                                <thead>
                                    <tr>
                                        {plan.columns.map((col) => (
                                            <th key={col.key}>{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={plan.columns.length} className={styles.empty}>
                                                Строк пока нет
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row) => (
                                            <tr key={row.id}>
                                                {plan.columns.map((col) => (
                                                    <td key={col.key}>
                                                        {renderCell(row.data[col.key], col.type)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : null}
            </div>

            <div className={styles.container_button}>
                <Link to="/metodkabinet/plans">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default WorkPlanViewPage;