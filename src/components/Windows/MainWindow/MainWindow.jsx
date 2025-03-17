import React, { useRef, useState } from "react";
import video from "./src_mainwindow/AIvideo1.mp4"
import styles from "./MainWindow.module.css"
import DropList from "../../DropList/DropList";
import NextPageButton from "../../UI/MyButtons/NextPageButton";
import { handleNextPage } from "../../../app/utils";

const MainWindow = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef=useRef(null);

  const handleVideoClick = () => {
    if(isPlaying){
      videoRef.current.pause();
    }
    else{
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

    return(
        <div className={styles.mainWindowContainer}>
          <div className={styles.mainWindowContainer_video}>
              <video
              ref={videoRef}
            autoPlay={isPlaying}
            onClick={handleVideoClick}
            loop
            muted={false} // Установите в false, чтобы включить звук
            className={styles.fullScreenVideo}
          >
            <source src={video} type="video/mp4" />
          </video>
          </div>
          <div className={styles.NextButton}>
            <NextPageButton onClick={handleNextPage}></NextPageButton>
          </div>
          <div className={styles.mainWindowContainer_DropList}>
            <DropList></DropList>
          </div>
 
    </div>
    )
}

export default MainWindow;