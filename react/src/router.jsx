// router.jsx
import { createBrowserRouter } from "react-router-dom";
import JuicePOS from "./pages/JuicePOS";

const router = createBrowserRouter([
    {
        path: "/",
        element: <JuicePOS />,
    },
]);

export default router;
