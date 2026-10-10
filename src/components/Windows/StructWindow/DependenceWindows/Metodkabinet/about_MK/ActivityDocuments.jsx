import MyHat from "../../../../../Hat/MyHat";
import randompdf from "../../../AwardsWindow/srcAwards/Book.pdf"


const ActivityPage = () => {
    const arr = [
        {
            id: 0,
            name: "Важный документ",
            doc: randompdf,
            url: "fgj"
        },
        {
            id: 1,
            name: "Важный документ",
            doc: randompdf,
            url: "fgj"
        },
        {
            id: 2,
            name: "Важный документ",
            doc: randompdf,
            url: "fgj"
        },
        {
            id: 3,
            name: "Важный документ",
            doc: randompdf,
            url: "fgj"
        },
    ]
return(
    <div className={styles.container}>
        <div className={styles.container_head}>
            <MyHat heading="МЕТОДИЧЕСКИЙ"/>
        </div>

        <div className={styles.container_contant}>
            <div className={styles.contant_column}>
                <div>Нормативно-правовые документы</div>
                {arr.map((item) => {
                    <div className={styles.column_card} key={item.id}>
                        {item.name}
                        <button>Open</button>
                        {item.url}
                    </div>
                })}
            </div>
            <div className={styles.contant_column}>
                <div className={styles.column_card}>
                   <div>Методические рекомендации</div>
                </div>
            </div>
            <div className={styles.contant_column}>
                <div className={styles.column_card}>
                    <div>
                        Пособия, памятки
                    </div>
                </div>
            </div>
        </div>
                
        <div className={styles.container_button}>
            <Link to="/metodkabinet">
                <BeforePageButton/>
            </Link>
        </div>
    </div>
)
}

export default ActivityPage;