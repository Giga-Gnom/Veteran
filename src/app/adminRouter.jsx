import { elements } from "chart.js";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/AdminWindows/AdminLayout/AdminLayout";
import AdminDashboard from "../components/AdminWindows/AdminDashboard/AdminDashboard";

export const adminRouter = createBrowserRouter([
    {
        path: "/",
        element: <AdminLayout/>,
        children: [ 
            {
                index: true,
                element: <AdminDashboard/>
            }
        ]
    }
])