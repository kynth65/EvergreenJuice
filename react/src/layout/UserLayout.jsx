// layouts/DefaultLayout.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function UserLayout() {
    const { token } = useStateContext();

    // If user is not authenticated, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}
