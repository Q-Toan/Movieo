import { createBrowserRouter } from "react-router-dom";
import { lazy } from 'react';
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy load page components for code splitting
const Home = lazy(() => import("../pages/Home"));
const ExplorePgae = lazy(() => import("../pages/ExplorePgae"));
const DetailPage = lazy(() => import("../pages/DetailPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const TrendingPerson = lazy(() => import("../pages/TrendingPerson"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignUpPage = lazy(() => import("../pages/SignUpPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

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
                path: "profile",
                element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
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