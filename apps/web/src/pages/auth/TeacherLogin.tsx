import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  TreePine,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function TeacherLogin() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (email: string, password: string) => {
        try {
        await api.post("/auth/signIn/teacher", { email, password });
        await refreshUser();
        navigate("/teacher");
        } catch (error) {
        console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#0d2818] relative">

        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-b from-[#1b4d2f] via-[#123420] to-[#0d2818]" />

        {/* Floating Decorations */}

        <Sparkles
            className="absolute top-20 left-20 text-yellow-400 animate-pulse"
            size={28}
        />

        <Trophy
            className="absolute bottom-32 right-24 text-yellow-300 animate-bounce"
            size={34}
        />

        <TreePine
            className="absolute bottom-0 left-10 text-green-900 opacity-40"
            size={220}
        />

        <TreePine
            className="absolute bottom-0 right-20 text-green-950 opacity-50"
            size={250}
        />

        <div className="relative z-10 flex min-h-screen">

            {/* Left */}

            <div className="hidden lg:flex flex-1 items-center justify-center">

            <div className="max-w-lg">

                <div className="flex items-center gap-3">

                <div className="w-14 h-14 bg-[#4fae4f] border-[3px] border-black shadow-[5px_5px_0_0_#000] flex items-center justify-center">

                    <TreePine className="text-[#0d2818]" />

                </div>

                <div>

                    <h1 className="font-pixel text-[#f5c542] text-lg">
                    ELEMATH 2.0
                    </h1>

                    <p className="text-green-200 mt-2">
                    Teacher Portal
                    </p>

                </div>

                </div>

                <h2 className="font-pixel text-3xl leading-relaxed text-[#f6ecd9] mt-10">
                Welcome Back
                <br />
                Explorer!
                </h2>

                <p className="mt-6 text-green-100 leading-8">
                Continue your adventure and manage classrooms,
                AI-generated quizzes, students, and achievements.
                </p>

            </div>

            </div>

            {/* Login */}

            <div className="flex flex-1 items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="bg-[#f6ecd9] border-[3px] border-black shadow-[8px_8px_0_0_#000] p-8">

                <h2 className="font-pixel text-center text-[#1b120a] text-lg">
                    Teacher Login
                </h2>

                <p className="text-center text-gray-600 mt-4">
                    Login to continue your adventure.
                </p>

                {/* Email */}

                <div className="mt-8">

                    <label className="font-silk text-xs">
                    Email
                    </label>

                    <div className="mt-2 relative">

                    <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        size={18}
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="teacher@email.com"
                        className="w-full border-[3px] border-black bg-white pl-12 pr-4 py-3 outline-none focus:ring-4 focus:ring-yellow-300"
                    />

                    </div>

                </div>

                {/* Password */}

                <div className="mt-6">

                    <label className="font-silk text-xs">
                    Password
                    </label>

                    <div className="relative mt-2">

                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        size={18}
                    />

                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full border-[3px] border-black bg-white pl-12 pr-12 py-3 outline-none focus:ring-4 focus:ring-yellow-300"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                        <EyeOff size={18} />
                        ) : (
                        <Eye size={18} />
                        )}
                    </button>

                    </div>

                </div>

                {/* Remember */}

                <div className="flex justify-between items-center mt-6">

                    <label className="flex gap-2 items-center text-sm">

                    <input type="checkbox" />

                    Remember me

                    </label>

                    <button className="text-sm text-green-700 hover:underline">
                    Forgot Password?
                    </button>

                </div>

                {/* Login */}

                <button
                    className="mt-8 w-full bg-[#f5c542] hover:bg-[#ffd75e]
                    border-[3px] border-black
                    py-3
                    font-silk
                    shadow-[4px_4px_0_0_#000]
                    active:translate-x-[3px]
                    active:translate-y-[3px]
                    active:shadow-none"
                    onClick={() => handleLogin(email, password)}
                >
                    LOGIN TO CLASSROOM
                </button>

                <div className="text-center mt-6 text-sm">

                    New teacher?

                    <button className="ml-2 text-green-700 hover:underline">
                    Create Classroom
                    </button>

                </div>

                </div>

            </div>

            </div>

        </div>

        </div>
    );
}