import React, { useCallback, useEffect, useState } from "react";
import styles from "./FolderBlock.module.css";
import { useNavigate } from "react-router-dom";
import eventsService from "../../../services/eventsService";

const FolderBlock = ({ folder }) => {
    const navigate = useNavigate();
    const [firstImg, setFirstImg] = useState(null)

    useEffect(() => {
        handleLoadImg()
    }, [folder.id])

    const handleLoadImg = async () => {
        try{
            const result = await eventsService.getFirstImageFormFolder(folder.id)
            console.log("current img: ", result)
            if (result.length > 0){
                setFirstImg(result[0].image_path)
            } else {
                setFirstImg(null)
            }
        } catch (error) {
            console.error("error loading load img, ", error)
        }
    }

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
            {firstImg ? (
                <img src={firstImg} className={styles.folder_image} alt="" />
            ) : (
                <div className={styles.folder_placeholder}>хахахъахахахахах</div>
            )}
            <div className={styles.container_text}>{folder.title}</div>
        </div>
    );
}

export default FolderBlock;