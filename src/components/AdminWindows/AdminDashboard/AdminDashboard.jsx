import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WindowCard from '../admin_components/WindowCard';
import styles from "./AdminDashboard.module.css"
import { AdminWindowsArray } from '../AdminWindowsArray';

const AdminDashboard = () => {
  const [activeCard, setActiveCard] = useState(null)
  const location = useLocation()

  const getActiveCardFromPath = () => {
    const currentPath = location.pathname
    const card = AdminWindowsArray.find(e => e.path === currentPath)
    return card ? card.name : null
  }

  const handleCardClick = (cardName) => {
    setActiveCard(cardName)
  }
  return (
    <div className={styles.windowCards_container}>
      {AdminWindowsArray.map((e, i) => <WindowCard key={i} name={e.name} path={e.path} 
      isActive={activeCard === e.name || getActiveCardFromPath() === e.name}
      onClick={()=>handleCardClick(e.name)}/>)}
    </div>
  );
};

export default AdminDashboard;