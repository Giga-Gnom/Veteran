import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./EventsWindow.module.css";
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import EventBlock from "./EventBlock";
import { v4 as uuidv4 } from "uuid";
import Carousel from "react-spring-3d-carousel";
import { foldersArray } from "./foldersArray";
import FolderBlock from "./folderblock";
import { useLocation, useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";

const EventsWindow = () => {
  const [goToSlide, setGoToSlide] = useState(0);
  const location = useLocation()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      const savedSlide = sessionStorage.getItem("eventsCarouselSlide")
      const fromDepartment = location.state?.fromEventDepartment === true || sessionStorage.getItem("fromEventDepartment") === "true"


       console.log("DEBUG - savedSlide:", savedSlide, 
                  "fromDepartment:", fromDepartment, 
                  "location.state:", location.state)

      if (savedSlide && fromDepartment) {
        setGoToSlide(parseInt(savedSlide, 10))
        console.log("востоновлен слайд ", savedSlide)
      }
      else {
        setGoToSlide(0)
        sessionStorage.setItem("eventsCarouselSlide", "0")
      }

      sessionStorage.setItem("fromEventDepartment", "false")
      isInitialLoad.current = false

    }
  }, [location.state])

  useEffect(()=> {
    if(!isInitialLoad.current) {
      sessionStorage.setItem("eventsCarouselSlide", goToSlide.toString())
      console.log("saved slide: ", goToSlide)
    }
  }, [goToSlide])

  console.log("foldersArray:", foldersArray.length, "элементов");


  const slides = foldersArray.map((event) => ({
    key: uuidv4(),
    content: <FolderBlock event={event} />
  }));

    const nextSlide = () => {
    const newSlide = (goToSlide + 1) % foldersArray.length;
    setGoToSlide(newSlide);
  };

  const prevSlide = () => {
    const newSlide = (goToSlide - 1 + foldersArray.length) % foldersArray.length;
    setGoToSlide(newSlide);
  };

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
            showNavigation={false}
            animationConfig={{ tension: 120, friction: 14 }}
            onChange={setGoToSlide}
          />

          <div className={styles.buttons_container}>
            <button onClick={prevSlide} className={styles.slideChanger_button_left}></button>
            <button onClick={nextSlide} className={styles.slideChanger_button_right}></button>
          </div>
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
