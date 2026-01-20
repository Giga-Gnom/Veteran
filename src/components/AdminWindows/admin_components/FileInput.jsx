import styles from "./AdminComponents.module.css"

export const FileInput = ({onChange, id}) => {
    return(
        <label htmlFor="documents" className={styles.drop_container} id="dropcontainer">
                                <input 
                                type="file" 
                                accept=".pdf" 
                                required
                                onChange={onChange}
                                id={id}/>
                            </label>
    )
}