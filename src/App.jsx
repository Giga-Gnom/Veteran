import './App.css'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { router } from './app/router'
import { useAdmin } from './hooks/useAdmin'
import AdminPanel from './admin/AdminPanel'


function App() {  
  const {isAdminVisible, isAuthenticated, login, logout} = useAdmin()

  return (
    <>
      <RouterProvider router={router}/>

      {isAdminVisible && (
        <AdminPanel
        onClose={logout}
        isAuthenticated={isAuthenticated}
        onLogin={login}/>
      )}
    </>
    )
}

export default App
