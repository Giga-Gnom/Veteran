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
import Akchurin from "../components/Windows/DirectorsWindow/Akchurin";
import Aksenov from "../components/Windows/DirectorsWindow/Aksenov";
import Pashkov from "../components/Windows/DirectorsWindow/Pashkov";
import Miscovec from "../components/Windows/DirectorsWindow/Miscovec";
import StructWindow from "../components/Windows/StructWindow/StructWindow";
import StatisticWindow from "../components/Windows/StatisticWindow/StatisticWindow";
import MoscoMapWindow from "../components/Windows/MapWindow/MoscowMapWindow";
import MGSVWindow from "../components/Windows/StructWindow/DependenceWindows/MgsvWindow/MGSVWindow";
import PrezidiumWindow from "../components/Windows/StructWindow/DependenceWindows/Prezidium/PrezidiumWindow";
import OrganizationWindow from "../components/Windows/StructWindow/DependenceWindows/OrganizationWindow/OrganizationWindow";
import SocDefWindow from "../components/Windows/StructWindow/DependenceWindows/SocDefWindow/SocDefWindow";
import YoungPeopleWindow from "../components/Windows/StructWindow/DependenceWindows/YoungPeopleWindow/YoungPeopleWindow";
import InformationOtdelWindow from "../components/Windows/StructWindow/DependenceWindows/InformationOtdelWindow/InformationOtdelWindow";
import BuhgalteriaWindow from "../components/Windows/StructWindow/DependenceWindows/BuhgalteriaWindow/BuhgalteriaWindow";
import LawyerWindow from "../components/Windows/StructWindow/DependenceWindows/LawyerWindow/LawyerWindow";
import SecretaryWindow from "../components/Windows/StructWindow/DependenceWindows/SecretaryWindow/SecretaryWindow";
import SocialCommissions from "../components/Windows/StructWindow/DependenceWindows/SocialCommissions/SocialCommissions";
import TroAOWindow from "../components/Windows/MapWindow/DistrictWindows/TroAOWindow/TroAOWindow";
import NovAOWindow from "../components/Windows/MapWindow/DistrictWindows/NovAOWindow/NovAOWindow";
import ZelAOWindow from "../components/Windows/MapWindow/DistrictWindows/ZelAOWindow/ZelAOWindow";
import UZAOWindow from "../components/Windows/MapWindow/DistrictWindows/UZAOWindow/UZAOWindow";
import UAOWindow from "../components/Windows/MapWindow/DistrictWindows/UAOWindow/UAOWindow";
import CAOWindow from "../components/Windows/MapWindow/DistrictWindows/CAOWindow/CAOWindow";
import UVAOWindow from "../components/Windows/MapWindow/DistrictWindows/UVAOWindow/UVAOWindow";
import VAOWindow from "../components/Windows/MapWindow/DistrictWindows/VAOWindow/VAOWindow";
import SVAOWindow from "../components/Windows/MapWindow/DistrictWindows/SVAOWindow/SVAOWindow";
import SAOWindow from "../components/Windows/MapWindow/DistrictWindows/SAOWindow/SAOWindow";
import SZAOWindow from "../components/Windows/MapWindow/DistrictWindows/SZAOWindow/SZAOWindow";
import ZAOWindow from "../components/Windows/MapWindow/DistrictWindows/ZAOWindow/ZAOWindow";
import CAOorganizations from "../components/Windows/MapWindow/DistrictWindows/CAOWindow/CAOorganizations/CAOorganizations";
import SAOorganizations from "../components/Windows/MapWindow/DistrictWindows/SAOWindow/SAOorganization/SAOorganization";
import SVAOorganization from "../components/Windows/MapWindow/DistrictWindows/SVAOWindow/SVAOorganization/SVAOorganization";
import SZAOorganization from "../components/Windows/MapWindow/DistrictWindows/SZAOWindow/SZAOorganization/SZAOorganization";
import UAOorganization from "../components/Windows/MapWindow/DistrictWindows/UAOWindow/UAOorganization/UAOorganization";




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
        path: "/akchurin",
        element: <Akchurin/>
    },
    {
        path: "/aksenov",
        element: <Aksenov/>
    },
    {
        path: "/miscovec",
        element: <Miscovec/>
    },
    {
        path: "/pashkov",
        element: <Pashkov/>
    },
    {
        path: "/struct",
        element: <StructWindow/>
    },
    {
        path: "/map",
        element: <MoscoMapWindow/>
    },
    {
        path: "/statistic",
        element: <StatisticWindow/>
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
        path: "/mgsv",
        element: <MGSVWindow/>
    },
    {
        path: "/prezidium",
        element: <PrezidiumWindow/>
    },
    {
        path: "/organization",
        element: <OrganizationWindow/>
    },
    {
        path: "/socdef",
        element: <SocDefWindow/>
    },
    {
        path: "/youngpeoples",
        element: <YoungPeopleWindow/>
    },
    {
        path: "/otdelinfo",
        element: <InformationOtdelWindow/>
    },
    {
        path: "/buhgalteria",
        element: <BuhgalteriaWindow/>
    },
    {
        path: "/lawyer",
        element: <LawyerWindow/>
    },
    {
        path: "/secretary",
        element: <SecretaryWindow/>
    },
    {
        path: "/commissions/:id",
        element: <SocialCommissions/>
    },
    {
      path: "/district/troitskiy",
      element: <TroAOWindow />
    },
    {
      path: "/district/novomoskovsky",
      element: <NovAOWindow />
    },
    {
      path: "/district/zelenograd",
      element: <ZelAOWindow />
    },
    {
        path: "/district/southwest",
        element: <UZAOWindow />
    },
    {
        path: "/district/southeast",
        element: <UVAOWindow />
    },
    {
        path: "/district/south",
        element: <UAOWindow />
    },
    {
        path: "/district/south/:areaID",
        element: <UAOorganization />
    },
    {
        path: "/district/central",
        element: <CAOWindow />
    },
    {
        path: "/district/central/:areaID",
        element: <CAOorganizations />
    },
    {
        path: "/district/east",
        element: <VAOWindow />
    },
    {
        path: "/district/northeast",
        element: <SVAOWindow />
    },
    {
        path: "/district/northeast/:areaID",
        element: <SVAOorganization />
    },
    {
        path: "/district/north",
        element: <SAOWindow />
    },
    {
        path: "/district/north/:areaID",
        element: <SAOorganizations />
    },
    {
        path: "/district/northwest",
        element: <SZAOWindow />
    },
    {
        path: "/district/northwest/:areaID",
        element: <SZAOorganization />
    },
    {
        path: "/district/west",
        element: <ZAOWindow />
    },
    {
        path: "*",
        element: <MainWindow/>
    },
])