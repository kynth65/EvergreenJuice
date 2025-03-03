// router.jsx
import { createBrowserRouter } from "react-router-dom";
import JuicePOS from "./pages/JuicePOS";
import RecipePage from "./pages/RecipePage";
import InstructionsMenu from "./pages/InstructionsMenu";
import ProductManagement from "./pages/ProductManagement";

const router = createBrowserRouter([
    {
        path: "/",
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
]);

export default router;
