import React, { createContext, useContext, useState } from "react";

const CarouselContext = createContext();

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};

export const CarouselProvider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  return (
    <CarouselContext.Provider value={{ currentSlide, setCurrentSlide }}>
      {children}
    </CarouselContext.Provider>
  );
};

export default CarouselContext;