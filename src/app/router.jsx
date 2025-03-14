import { createBrowserRouter } from "react-router-dom";
import MainWindow from "../components/Windows/MainWindow/MainWindow";
import HelloWindow from "../components/Windows/HelloWindow/HelloWindow";
import CreationHistoryWindow from "../components/Windows/CreationHistoryWindow/CreationHistoryWindow";
import PlaceHistoryWindow from "../components/Windows/PlaceHistoryWindow/PlaceHistoryWindow";
import DirectorsWindow from "../components/Windows/DirectorsWindow/DirectorsWindow";
import RegionalConnectionWindow from "../components/Windows/RegionalConnectionWindow/RegionalConnectionWindow";
import EventsWindow from "../components/Windows/EventsWindow/EventsWindow";
import AwardsWindow from "../components/Windows/AwardsWindow/AwardsWindow";
import NewspaperWindow from "../components/Windows/NewspaperWindow/NewspaperWindow";
import PartnersWindow from "../components/Windows/PartnersWindow/PartnersWindow";
import StandartDocumentsWindow from "../components/Windows/StandartDocumentsWindow/StandartDocumentsWindow";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainWindow />
    },
    {
        path: "/hello",
        element: <HelloWindow/>
    },
    {
        path: "/createhistory",
        element: <CreationHistoryWindow/>
    },
    {
        path: "/placehistory",
        element: <PlaceHistoryWindow/>
    },
    {
        path: "/directors",
        element: <DirectorsWindow/>
    },
    {
        path: "/regions",
        element: <RegionalConnectionWindow/>
    },
    {
        path: "/events",
        element: <EventsWindow/>
    },
    {
        path: "/awards",
        element: <AwardsWindow/>
    },
    {
        path: "/newspapers",
        element: <NewspaperWindow/>
    },
    {
        path: "/partners",
        element: <PartnersWindow/>
    },
    {
        path: "/standarts",
        element: <StandartDocumentsWindow/>
    },
    {
        path: "*",
        element: <MainWindow/>
    },
])