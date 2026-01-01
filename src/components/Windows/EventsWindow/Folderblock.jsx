import React from "react";
import styles from "./FolderBlock.module.css";
import { useNavigate } from "react-router-dom";

const FolderBlock = ({ folder }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/gallery/${folder.id}`, { 
            state: { 
                folderTitle: folder.title,
                folderId: folder.id 
            }
        });
        console.log("folder id ", folder.id, " folder title ", folder.title)
    };

    return(
        <div className={styles.container} onClick={onClick}>
            <div className={styles.folder_icon}>📁</div>
            <div className={styles.container_text}>{folder.title}</div>
        </div>
    );
}

export default FolderBlock;