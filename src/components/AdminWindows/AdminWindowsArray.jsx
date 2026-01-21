import AdminAwardsWindow from "./AdminAwardsWindow/AdminAwardsWindow";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminEventsWindow from "./AdminEventsWindow/AdminEventsWindow";
import AdminMapWindow from "./AdminMapWindow/AdminMapWindow";
import AdminNewspapersWindow from "./AdminNewspapersWindow/AdminNewspapersWindow";
import AdminRegionsWindow from "./AdminRegionsWindow/AdminRegionsWindow";
import AdminStandartWindow from "./AdminStandartWindow/AdminStandartWindow";
import AdminStatisticsWindow from "./AdminStatisticWindow/AdminStatisticsWindow";

export const AdminWindowsArray = [
    {
        name: "Карта",
        path: "map",
        element: <AdminMapWindow/>
    },
    {
        name: "Статистика",
        path: "statistic",
        element: <AdminStatisticsWindow/>
    },
    {
        name: "Региональные связи",
        path: "regions",
        element: <AdminRegionsWindow/>
    },
    {
        name: "Мероприятия",
        path: "events",
        element: <AdminEventsWindow/>
    },
    {
        name: "Награды",
        path: "awards",
        element: <AdminAwardsWindow/>
    },
    {
        name: "Газеты",
        path: "newspapers",
        element: <AdminNewspapersWindow/>
    },
    {
        name: "Нормативные документы",
        path: "documents",
        element: <AdminStandartWindow/>
    }
]