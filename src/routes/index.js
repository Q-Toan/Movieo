import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import ExplorePgae from "../pages/ExplorePgae";
import DetailPage from "../pages/DetailPage";
import SearchPage from "../pages/SearchPage";
import TrendingPerson from "../pages/TrendingPerson";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import WatchlistPage from "../pages/WatchlistPage";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>,
            },
            {
                path: ":explore",
                element: <ExplorePgae/>,
            },
            {
                path: ":explore/:id",
                element: <DetailPage />
            },
            {
                path: "search",
                element: <SearchPage/>,
            },
            {
                path: "trending/all/:id",
                element: <TrendingPerson/>,
            },
            {
                path: "watchlist",
                element: <ProtectedRoute><WatchlistPage /></ProtectedRoute>
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignUpPage />
    }
]);

export default router;