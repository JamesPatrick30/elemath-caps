import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return authenticated
        ? <Outlet />
        : <Navigate to="/" replace />;
}