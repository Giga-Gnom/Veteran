// components/AdminWindows/AdminLayout/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import AdminHeader from '../admin_components/AdminHeader';
import AdminDashboard from '../AdminDashboard/AdminDashboard';

const AdminLayout = () => {
  
  console.log('🏠 AdminLayout - current path:', location.pathname);

  return (
    <div className={styles.admin_layout}>
      <AdminHeader/>
      
      <main className={styles.admin_main}>
        <AdminDashboard/>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;