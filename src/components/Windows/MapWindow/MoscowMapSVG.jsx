import styles from "./MoscowMapWindow.module.css"
import React from "react"
import { districtsData } from './districtsData';

const MoscowMapSVG = ({ onDistrictClick, activeDistrict }) => {
    const handleMouseEnter = (e) => {
        e.target.style.fill = '#ffcc00';
      };
    
      const handleMouseLeave = (e) => {
        if (activeDistrict !== e.target.dataset.id) {
          e.target.style.fill = '#ddff55';
        }
      };
    
      const handleClick = (e) => {
        const districtId = e.target.dataset.id;
        const district = districtsData.find(d => d.id === districtId);
        onDistrictClick(district);
      };
    return(
        <svg viewBox="0 0 1000 800" className={styles.map}>
            {districtsData.map((district,index) => (
        <path
          key={index}
          d={district.path}
          data-id={district.id}
          className={styles.district}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ))}
        </svg>
    )
}

export default MoscowMapSVG;