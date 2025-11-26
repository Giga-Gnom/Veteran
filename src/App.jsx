// src/App.jsx
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import AdminApp from './AdminApp'
import { useEffect, useState } from 'react'

function App() { 
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('=== APP STARTED ===')
    console.log('📍 Location:', window.location.href)
    console.log('🔗 Hash:', window.location.hash)
    console.log('📍 Pathname:', window.location.pathname)
    console.log('🔍 Search:', window.location.search)
    
    const hasAdminHash = window.location.hash === '#admin'
    console.log('🛠️ Is admin mode:', hasAdminHash)
    
    setIsAdmin(hasAdminHash)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        background: '#f5f5f5'
      }}>
        ⏳ Загрузка приложения...
      </div>
    )
  }

  if (isAdmin) {
    console.log('🎯 Rendering AdminApp')
    return <AdminApp />
  }

  console.log('📱 Rendering Kiosk App')
  return <RouterProvider router={router}/>
}

export default App