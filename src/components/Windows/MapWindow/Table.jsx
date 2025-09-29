import React from "react";
import styles from "./Table.module.css"

const Table = () => {
    return(
        <div className={styles.marginRight}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Округ</th>
                        <th className={styles.th}>Количество первичных организаций</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЦАО</td>
                        <td className={styles.td}>129</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>САО</td>
                        <td className={styles.td}>104</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>СВАО</td>
                        <td className={styles.td}>123</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ВАО</td>
                        <td className={styles.td}>131</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЮВАО</td>
                        <td className={styles.td}>83</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЮАО</td>
                        <td className={styles.td}>145</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЮЗАО</td>
                        <td className={styles.td}>106</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЗАО</td>
                        <td className={styles.td}>119</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>СЗАО</td>
                        <td className={styles.td}>79</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ЗелАО</td>
                        <td className={styles.td}>23</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>ТиНАО</td>
                        <td className={styles.td}>28</td>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>Итого</td>
                        <td className={styles.td}>1070</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table