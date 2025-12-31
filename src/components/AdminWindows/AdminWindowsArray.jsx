import AdminAwardsWindow from "./AdminAwardsWindow/AdminAwardsWindow";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminNewspapersWindow from "./AdminNewspapersWindow/AdminNewspapersWindow";
import AdminStandartWindow from "./AdminStandartWindow/AdminStandartWindow";

export const AdminWindowsArray = [
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