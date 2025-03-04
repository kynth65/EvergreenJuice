// layouts/GuestLayout.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
    const { token } = useStateContext();

    // If user is authenticated, redirect to main application
    if (token) {
        return <Navigate to="/juice" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}
