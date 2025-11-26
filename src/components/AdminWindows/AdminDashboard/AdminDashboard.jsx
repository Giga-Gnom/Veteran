// components/AdminWindows/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import WindowCard from '../admin_components/WindowCard';
import styles from "./AdminDashboard.module.css"
import { AdminWindowsArray } from '../AdminWindowsArray';

const AdminDashboard = () => {
  return (
    <div className={styles.windowCards_container}>
      {AdminWindowsArray.map((e, i) => <WindowCard key={i} name={e.name} path={e.path}/>)}
    </div>
  );
};

export default AdminDashboard;