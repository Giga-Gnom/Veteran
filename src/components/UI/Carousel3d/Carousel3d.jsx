import React, { useCallback, useRef, useState } from "react";
import styles from "./Carousel3d.module.css";

const Carousel3d = ({ children, gap = 0 }) => {
  const [rotationY, setRotationY] = useState(0);
  const figureRef = useRef(null);
  const n = React.Children.count(children);
  
  const theta = n > 0 ? (2 * Math.PI) / n : 0;
  const apothem = n > 0 ? 200 / (2 * Math.tan(Math.PI / n)) : 0;

  // Drag to rotate
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    const startX = e.pageX || (e.touches && e.touches[0]?.pageX);
    
    if (startX === undefined || n === 0) return;
    
    const onMove = (moveEvent) => {
      const currentX = moveEvent.pageX || 
                      (moveEvent.touches && moveEvent.touches[0]?.pageX);
      
      if (currentX === undefined) return;
      
      const delta = startX - currentX;
      
      if (Math.abs(delta) > 30) {
        const direction = delta > 0 ? -1 : 1;
        setRotationY((prev) => prev + direction * theta);
        
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("touchend", onUp);
      }
    };
    
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("touchend", onUp);
    };
    
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("touchend", onUp);
  }, [n, theta]);

  // Button handlers
  const handlePrev = useCallback(() => {
    setRotationY((prev) => prev + theta); // Поворот вправо (предыдущий элемент)
  }, [theta]);

  const handleNext = useCallback(() => {
    setRotationY((prev) => prev - theta); // Поворот влево (следующий элемент)
  }, [theta]);

  const itemStyle = (i) => ({
    transformOrigin: `50% 50% ${-apothem}px`,
    transform: `rotateY(${i * theta}rad)`,
    padding: `0 ${gap}px`,
    backfaceVisibility: "hidden",
    visibility: n > 0 ? "visible" : "hidden",
    pointerEvents: "auto",
  });

  if (n === 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.carousel_figure} />
      </div>
    );
  }

  return (
    <div className={styles.carousel_container}>
      <div 
        className={styles.carousel} 
        onPointerDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <figure
          ref={figureRef}
          className={styles.carousel_figure}
          style={{
            transform: `rotateY(${rotationY}rad)`,
            transformOrigin: `50% 50% ${-apothem}px`,
            transition: "transform 0.3s ease",
            pointerEvents: "none",
          }}
        >
          {React.Children.map(children, (child, i) => (
            <div 
              key={i} 
              className={styles.carousel_figure_block} 
              style={itemStyle(i)}
            >
              {child}
            </div>
          ))}
        </figure>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        className={styles.carousel_button_prev} 
        onClick={handlePrev}
        aria-label="Previous"
      >
        
      </button>
      <button 
        className={styles.carousel_button_next} 
        onClick={handleNext}
        aria-label="Next"
      >
        
      </button>
    </div>
  );
};

export default Carousel3d;