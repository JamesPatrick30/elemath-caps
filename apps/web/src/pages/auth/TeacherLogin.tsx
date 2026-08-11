import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  TreePine,
  Sparkles,
  Trophy,
  Frown,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import type { loginForm } from "../../types";

/* ----------------------------------------------------------------------
   TEACHER LOGIN — Elemath 2.0
   Same jungle-pixel language as the student login, in the gold "teacher"
   register instead of student green. Fixes applied to your draft:
   - Password field + submit button were rendered outside the <form>,
     so Enter-to-submit and the click handler never actually fired.
     Everything now lives inside one <form onSubmit={handleLogin}>.
   - Added a loading state and a plain-language error message instead of
     a silent console.error, so a teacher gets feedback on a failed login.
   - Added back-to-home and student-login cross links for easy navigation,
     matching the student login page.
------------------------------------------------------------------------- */

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState<loginForm>({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signIn/teacher", { email: loginData.email, password: loginData.password });
      await refreshUser();
      navigate("/teacher");
    } catch (error) {
      console.error("Login failed:", error);
      setError("We couldn't log you in. Double-check your email and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0d2818] relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-silk { font-family: 'Silkscreen', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b4d2f] via-[#123420] to-[#0d2818]" />

      {/* Floating Decorations */}
      <Sparkles className="absolute top-20 left-20 text-yellow-400 animate-pulse" size={28} />
      <Trophy className="absolute bottom-32 right-24 text-yellow-300 animate-bounce" size={34} />
      <TreePine className="absolute bottom-0 left-10 text-green-900 opacity-40" size={220} />
      <TreePine className="absolute bottom-0 right-20 text-green-950 opacity-50" size={250} />

      {/* Back to home */}
      <div className="relative z-10 px-6 pt-6">
        <Link
          to="/"
          className="font-silk inline-flex items-center gap-2 text-[10px] text-[#dff2e1] hover:text-[#f5c542] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-64px)]">
        {/* Left */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#4fae4f] border-[3px] border-black shadow-[5px_5px_0_0_#000] flex items-center justify-center">
                <TreePine className="text-[#0d2818]" />
              </div>
              <div>
                <h1 className="font-pixel text-[#f5c542] text-lg">ELEMATH 2.0</h1>
                <p className="text-green-200 mt-2">Teacher Portal</p>
              </div>
            </div>

            <h2 className="font-pixel text-3xl leading-relaxed text-[#f6ecd9] mt-10">
              Welcome Back
              <br />
              Explorer!
            </h2>

            <p className="mt-6 text-green-100 leading-8">
              Continue your adventure and manage classrooms, AI-generated
              quizzes, students, and achievements.
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="bg-[#f6ecd9] border-[3px] border-black shadow-[8px_8px_0_0_#000] p-8">
              <h2 className="font-pixel text-center text-[#1b120a] text-lg">
                Teacher Login
              </h2>

              <p className="text-center text-gray-600 mt-4">
                Login to continue your adventure.
              </p>

              <form onSubmit={handleLogin} className="mt-8" noValidate>
                {/* Email */}
                <label className="font-silk text-xs" htmlFor="email">
                  Email
                </label>

                <div className="mt-2 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3524]" size={18} />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="teacher@email.com"
                    className="w-full border-[3px] border-black bg-white pl-12 pr-4 py-3 outline-none focus:ring-4 focus:ring-yellow-300"
                  />
                </div>

                {/* Password */}
                <div className="mt-6">
                  <label className="font-silk text-xs" htmlFor="password">
                    Password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3524]" size={18} />
                    <input
                      id="password"
                      required
                      autoComplete="current-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full border-[3px] border-black bg-white pl-12 pr-12 py-3 outline-none focus:ring-4 focus:ring-yellow-300"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a3524] hover:text-[#1b120a]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex justify-between items-center mt-6">
                  <label className="flex gap-2 items-center text-sm">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <Link to="/teacher/forgot-password" className="text-sm text-green-700 hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="mt-6 flex items-start gap-3 bg-[#ffe3d6] border-[3px] border-[#c0432a] px-4 py-3">
                    <Frown className="w-5 h-5 text-[#c0432a] shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-[#7a2916] text-left leading-snug">{error}</p>
                  </div>
                )}

                {/* Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full bg-[#f5c542] hover:bg-[#ffd75e] disabled:bg-[#f0dda0] disabled:cursor-not-allowed
                    border-[3px] border-black
                    py-3
                    font-silk
                    shadow-[4px_4px_0_0_#000]
                    active:translate-x-0.75
                    active:translate-y-0.75
                    active:shadow-none
                    transition-all duration-100"
                >
                  {loading ? "LOGGING IN..." : "LOGIN TO CLASSROOM"}
                </button>

                <div className="text-center mt-6 text-sm">
                  New teacher?
                  <Link to="/teacher/signup" className="ml-2 text-green-700 hover:underline">
                    Create Classroom
                  </Link>
                </div>

                <div className="text-center mt-4 pt-4 border-t-[3px] border-dashed border-[#d8c6a8]">
                  <p className="font-silk text-[9px] text-[#8a7a5f] tracking-wide">
                    ARE YOU A STUDENT?
                  </p>
                  <Link
                    to="/student/login"
                    className="font-silk inline-flex items-center gap-1 text-[10px] text-[#4fae4f] hover:text-[#3a8f3a] mt-2"
                  >
                    GO TO STUDENT LOGIN
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}