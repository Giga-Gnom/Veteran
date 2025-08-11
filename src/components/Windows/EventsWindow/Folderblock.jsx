import React from "react";
import styles from "./FolderBlock.module.css";
import { handleImgClick } from "../../../app/utils";
import { useNavigate } from "react-router-dom";

const FolderBlock = ({event}) => {

      const navigate = useNavigate();

    const onClick = () => {
        navigate(`/gallery/${encodeURIComponent(event.name)}`)
    }
    return(
        <div className={styles.container} onClick={onClick}>
            <img className={styles.container_image} src={event.img} alt=""/>
            <div className={styles.container_text}>{event.name}</div>
        </div>
    )
}

export default FolderBlock;