import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { api } from "../api/axios";
type User = {
    id: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    authenticated: false,
    refreshUser: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
            // if (!res.data) {
            //     window.location.href = "/login";
            // }
            // if (res.data.role === "student") {
            //     navigate("/student");
            // }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(error);
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authenticated: !!user,
                refreshUser: loadUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);