import styles from "./AdminComponents.module.css"

export const FileInput = ({onChange, id}) => {
    return(
        <label htmlFor="documents" className={styles.drop_container} id="dropcontainer">
                                <span className={styles.drop_title}>Переместите сюда файл</span>
                                или
                                <input 
                                type="file" 
                                accept=".pdf" 
                                required
                                onChange={onChange}
                                id={id}/>
                            </label>
    )
}