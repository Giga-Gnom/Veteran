import React, { useEffect, useState } from 'react';
import styles from './DistrictInfoWindow.module.css';

const DistrictInfoWindow = ({ district }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (district) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [district]);

  if (!district || !isVisible) return null;

  return (
    <div className={`${styles.infoWindow} ${isVisible ? styles.visible : ''}`}>
      <h3>{district.name}</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Население:</span>
          <span className={styles.infoValue}>{district.population} тыс. чел.</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Площадь:</span>
          <span className={styles.infoValue}>{district.area} км²</span>
        </div>
      </div>
      <div className={styles.districts}>
        <h4>Районы:</h4>
        <ul>
          {district.districts.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
      <button 
        className={styles.closeButton}
        onClick={() => setIsVisible(false)}
      >
        ×
      </button>
    </div>
  );
};

export default DistrictInfoWindow;