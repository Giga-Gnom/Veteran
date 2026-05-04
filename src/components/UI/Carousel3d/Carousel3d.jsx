import React, { useCallback, useRef, useState } from "react";
import styles from "./Carousel3d.module.css";

const Carousel3d = ({ children, gap = 0 }) => {
  const [idx, setIdx] = useState(0);
  const figureRef = useRef(null);
  const n = React.Children.count(children);
  
  const theta = n > 0 ? (2 * Math.PI) / n : 0;
  const apothem = n > 0 ? 200 / (2 * Math.tan(Math.PI / n)) : 0;

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
        const direction = delta > 0 ? 1 : -1;
        setIdx((prevIdx) => (prevIdx + direction + n) % n);
        
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
  }, [n]);

  const itemStyle = (i) => ({
    transformOrigin: `50% 50% ${-apothem}px`,
    transform: `rotateY(${i * theta}rad)`,
    padding: `0 ${gap}px`,
    backfaceVisibility: "hidden",
    visibility: n > 0 ? "visible" : "hidden",
  });

  if (n === 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.carousel_figure} />
      </div>
    );
  }

  return (
    <div 
      className={styles.carousel} 
      onPointerDown={onDragStart}
      onTouchStart={onDragStart}
    >
      <figure
        ref={figureRef}
        className={styles.carousel_figure}
        style={{
          transform: `rotateY(${idx * -theta}rad)`,
          transformOrigin: `50% 50% ${-apothem}px`,
          transition: "transform 0.5s ease",
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
  );
};

export default Carousel3d;