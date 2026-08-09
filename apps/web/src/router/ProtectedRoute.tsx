import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "teacher" | "student";

interface ProtectedRouteProps {
    allowedRole: Role;
}

export default function ProtectedRoute({
    allowedRole,
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Authenticated but wrong role
    if (user.role !== allowedRole) {
        return (
            <Navigate
                to={user.role === "teacher" ? "/teacher" : "/student"}
                replace
            />
        );
    }

    return <Outlet />;
}