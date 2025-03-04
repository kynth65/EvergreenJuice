import { createBrowserRouter, Navigate } from "react-router-dom";
import JuicePOS from "./pages/JuicePOS";
import RecipePage from "./pages/RecipePage";
import InstructionsMenu from "./pages/InstructionsMenu";
import ProductManagement from "./pages/ProductManagement";
import Sales from "./pages/Sales";
import GuestLayout from "./layout/GuestLayout";
import UserLayout from "./layout/UserLayout";
import Login from "./Login";
import Signup from "./Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/juice" />,
            },
            {
                path: "/juice",
                element: <JuicePOS />,
            },
            {
                path: "/instructions",
                element: <InstructionsMenu />,
            },
            {
                path: "/recipe/:recipeId",
                element: <RecipePage />,
            },
            {
                path: "/products",
                element: <ProductManagement />,
            },
            {
                path: "/sales",
                element: <Sales />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
]);

export default router;
