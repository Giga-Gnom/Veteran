// src/AdminApp.jsx
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminWindows/AdminLayout/AdminLayout';
import { AdminWindowsArray } from './components/AdminWindows/AdminWindowsArray';

const OriginPage = () => (
  <div style={{padding: '20px'}}>
    <h2>Добро пожаловать в Панель Администрирования Приложения</h2>
    <p>Выберите раздел приложения для внесения изменений</p>
  </div>
)

function AdminApp() {
  console.log('🛠️ AdminApp loaded with MemoryRouter');
  
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<OriginPage/>}/>
          {AdminWindowsArray.map((e, i) => <Route path={e.path} element={e.element} key={i}/>)}
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default AdminApp;