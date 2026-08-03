import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute() {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return authenticated
        ? <Navigate to="/teacher" replace />
        : <Outlet />;
}