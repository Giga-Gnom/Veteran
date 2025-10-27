import './App.css'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { router } from './app/router'


function App() {  
  return (
    <RouterProvider router={router}/>
    )
}

export default App
