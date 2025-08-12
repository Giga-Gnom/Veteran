import React, { useState } from "react";
import styles from "./EventsWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import EventBlock from "./EventBlock";
import { v4 as uuidv4 } from "uuid";
import Carousel from "react-spring-3d-carousel";
import { foldersArray } from "./foldersArray";
import FolderBlock from "./folderblock";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";

const EventsWindow = () => {
  const [goToSlide, setGoToSlide] = useState(0);


  const slides = foldersArray.map((event) => ({
    key: uuidv4(),
    content: <FolderBlock event={event} />
  }));

  return (
    <div className={styles.container}>
      <div className={styles.container_head}>
        <MyHat heading="Наши Мероприятия" />
      </div>
      <div className={styles.container_content}>
        <div className={styles.container_content_carousel}>
          <Carousel
            slides={slides}
            goToSlide={goToSlide}
            offsetRadius={2}
            showNavigation={true}
            animationConfig={{ tension: 120, friction: 14 }}
            onChange={setGoToSlide}
          />
        </div>
        <div className={styles.container_content_slider}>
          <ImageSlider/>
        </div>
      </div>
      <div className={styles.container_bottom}>
        <BottomPanel />
      </div>
    </div>
  );
};

export default EventsWindow;
