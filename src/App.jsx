import './App.css'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import DropDownButton from './components/UI/MyButtons/DropDownButton'
import MyHat from './components/Hat/MyHat'
import DropList from './components/DropList/DropList'
import MainWindow from './components/Windows/MainWindow/MainWindow'
import NextPageButton from './components/UI/MyButtons/NextPageButton'
import HelloWindow from './components/Windows/HelloWindow/HelloWindow'
import CreationHistoryWindow from './components/Windows/CreationHistoryWindow/CreationHistoryWindow'
import PersonHistoryWindow from './components/Windows/PlaceHistoryWindow/PlaceHistoryWindow'
import PlaceHistoryWindow from './components/Windows/PlaceHistoryWindow/PlaceHistoryWindow'
import DirectorsWindow from './components/Windows/DirectorsWindow/DirectorsWindow'
import Director from './components/Windows/DirectorsWindow/Director'
import image from "../src/components/Windows/DirectorsWindow/srcDirectors/Akchurin.jpg"
import { useState } from 'react'
import Akchurin from './components/Windows/DirectorsWindow/Akchurin'
import Miscovec from './components/Windows/DirectorsWindow/Miscovec'
import Aksenov from './components/Windows/DirectorsWindow/Aksenov'
import Pashkov from './components/Windows/DirectorsWindow/Pashkov'
import RegionDocument from './components/Windows/RegionalConnectionWindow/RegionDocumebt'
import RegionalConnectionWindow from './components/Windows/RegionalConnectionWindow/RegionalConnectionWindow'
import EventsWindow from './components/Windows/EventsWindow/EventsWindow'
import AwardsWindow from './components/Windows/AwardsWindow/AwardsWindow'
import PartnersWindow from './components/Windows/PartnersWindow/PartnersWindow'
import NewspaperWindow from './components/Windows/NewspaperWindow/NewspaperWindow'
import StandartDocumentsWindow from './components/Windows/StandartDocumentsWindow/StandartDocumentsWindow'
import { router } from './app/router'


function App() {  
  return (
    <RouterProvider router={router}/>
    )
}

export default App
