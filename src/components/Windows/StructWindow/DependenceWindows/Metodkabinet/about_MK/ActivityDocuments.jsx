import { Link } from "react-router-dom";
import MyHat from "../../../../../Hat/MyHat";
import randompdf from "../../../../AwardsWindow/srcAwards/Book.pdf";
import BeforePageButton from "../../../../../UI/MyButtons/BeforePageButton";
import styles from "./ActivityDocuments.module.css";

const ActivityDocuments = () => {
    const arr = [
        { id: 0, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 1, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 2, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 3, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 4, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 5, name: "Важный документ", doc: randompdf, url: "fgj" },
        { id: 6, name: "Важный документ", doc: randompdf, url: "fgj" },
    ];

    const ActivityColumn = ({ title, items }) => (
        <div className={styles.contant_column}>
            <div className={styles.column_title}>{title}</div>
            <div className={styles.column_list}>
                {items.length === 0 ? (
                    <div className={styles.empty}>Документов нет</div>
                ) : (
                    items.map((item) => (
                        <div className={styles.column_card} key={item.id}>
                            <div className={styles.card_name}>{item.name}</div>
                            <button className={styles.card_button}>Open</button>
                            <div className={styles.card_url}>{item.url}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="МЕТОДИЧЕСКИЙ" />
            </div>

            <div className={styles.container_contant}>
                <ActivityColumn title="Нормативно-правовые документы" items={arr} />
                <ActivityColumn title="Методические рекомендации"     items={arr} />
                <ActivityColumn title="Пособия, памятки"              items={arr} />
            </div>

            <div className={styles.container_button}>
                <Link to="/metodkabinet">
                    <BeforePageButton />
                </Link>
            </div>
        </div>
    );
};

export default ActivityDocuments;