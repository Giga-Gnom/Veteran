import styles from "./MoscowMapWindow.module.css"
import React from "react"
import { districtsData } from './districtsData';

const MoscowMapSVG = ({ onDistrictClick, activeDistrict }) => {
  
      const handleClick = (e) => {
        const districtId = e.target.dataset.id;
        const district = districtsData.find(d => d.id === districtId);
        onDistrictClick(district);
      };
    return(
        <svg viewBox="0 0 1000 800" className={styles.map}>
          {districtsData.map((district,index) => (
            <g key={index}>
              <path
                d={district.path}
                data-id={district.id}
                className={styles.district}
                onClick={handleClick}
              />
              <text x={district.center.x} y={district.center.y} className={styles.map_text}>{district.name}</text>
            </g>
          ))}
        </svg>
    )
}

export default MoscowMapSVG;