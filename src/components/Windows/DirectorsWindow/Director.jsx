import React from "react";
import styles from "./Director.module.css"
import ReadMoreButton from "../../UI/MyButtons/ReadMoreButton";
import { Link } from "react-router-dom";
import { handleImgClick } from "../../../app/utils";

const Director = ({person}) => {
    return(
        <div className={styles.container}>
            <img className={styles.paint} src={person.img} alt=""/>
            <div className={styles.content_text}>
                <div className={styles.content_text_main}>
                    <h1 style={{color:"rgb(234, 79, 79)", justifyContent:"center"}}>{person.name}</h1>
                    <div>{person.text}</div>
                </div>
                <Link to={person.path}>
                    <ReadMoreButton/>
                </Link>
                
            </div>
        </div>
    )
}



export default Director;