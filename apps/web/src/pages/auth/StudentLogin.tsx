import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Gamepad2, TreePine, Eye, EyeOff, ArrowLeft, Frown } from "lucide-react";
import { LoginStudent } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

/* ----------------------------------------------------------------------
   STUDENT LOGIN — Elemath 2.0
   Same jungle-pixel language as the landing page, tuned all the way down
   for a young reader: one big parchment "quest card," oversized inputs
   and tap targets, a single obvious green button, and an error message
   that reads like a game hint ("Hmm, that didn't work") instead of a
   technical string. A mascot badge stands in for a profile photo so kids
   recognize the screen as "theirs" at a glance.
------------------------------------------------------------------------- */

const PixelPanel = ({
  children,
  className = "",
  tone = "parchment",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "parchment" | "jungle";
}) => {
  const tones: Record<string, string> = {
    parchment: "bg-[#f6ecd9] border-[#1b120a]",
    jungle: "bg-[#173a24] border-black",
  };
  return (
    <div className={`border-[3px] ${tones[tone]} shadow-[6px_6px_0_0_#000] ${className}`}>
      {children}
    </div>
  );
};

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await LoginStudent({ email, password });
      await refreshUser();
      console.log("Student login successful:", response.data);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Student login failed:", err);
      setError("Hmm, that didn't work. Check your email and password and try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a4d2e] via-[#123420] to-[#0d2818] flex flex-col overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-silk { font-family: 'Silkscreen', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* pixel cloud blocks, same as landing hero */}
      <div className="absolute top-10 left-8 w-16 h-6 bg-[#dff2e1]/70 opacity-70" style={{ clipPath: "polygon(0 40%,20% 40%,20% 0,60% 0,60% 40%,100% 40%,100% 100%,0 100%)" }} />
      <div className="absolute top-16 right-10 w-20 h-7 bg-[#dff2e1]/50 opacity-60" style={{ clipPath: "polygon(0 40%,20% 40%,20% 0,60% 0,60% 40%,100% 40%,100% 100%,0 100%)" }} />

      {/* canopy silhouette strip along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 flex">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              height: `${18 + (i % 4) * 6}px`,
              backgroundColor: i % 3 === 0 ? "#0a2015" : "#123420",
              alignSelf: "flex-end",
            }}
          />
        ))}
      </div>

      {/* back to home */}
      <div className="relative z-10 px-5 pt-6">
        <Link
          to="/"
          className="font-silk inline-flex items-center gap-2 text-[10px] text-[#dff2e1] hover:text-[#f5c542] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-10">
        {/* mascot badge */}
        <div className="w-20 h-20 bg-[#4fae4f] border-[3px] border-black shadow-[5px_5px_0_0_#000] flex items-center justify-center mb-6 animate-[float_4s_ease-in-out_infinite]">
          <Gamepad2 className="w-10 h-10 text-[#0d2818]" strokeWidth={2.5} />
        </div>

        <PixelPanel tone="parchment" className="w-full max-w-md p-7 sm:p-9">
          <div className="text-center mb-8">
            <p className="font-silk text-[9px] text-[#4fae4f] tracking-widest mb-3">
              &gt; STUDENT EXPEDITION
            </p>
            <h1 className="font-pixel text-[#1b120a] text-lg sm:text-xl leading-relaxed">
              WELCOME BACK,
              <br />
              EXPLORER!
            </h1>
            <p className="font-body text-[#4a3524] text-sm mt-4">
              Type in your email and password to jump back into the jungle.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5 text-left">
              <label
                className="font-silk block text-[10px] text-[#1b120a] mb-2 tracking-wide"
                htmlFor="email"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body w-full text-base px-4 py-3.5 bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000]
                text-[#1b120a] placeholder:text-[#a89a86]
                focus:outline-none focus:shadow-[3px_3px_0_0_#4fae4f] focus:border-[#4fae4f] transition-shadow"
              />
            </div>

            <div className="mb-6 text-left">
              <label
                className="font-silk block text-[10px] text-[#1b120a] mb-2 tracking-wide"
                htmlFor="password"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body w-full text-base px-4 py-3.5 pr-12 bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000]
                  text-[#1b120a] placeholder:text-[#a89a86]
                  focus:outline-none focus:shadow-[3px_3px_0_0_#4fae4f] focus:border-[#4fae4f] transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a3524] hover:text-[#1b120a]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 bg-[#ffe3d6] border-[3px] border-[#c0432a] px-4 py-3">
                <Frown className="w-5 h-5 text-[#c0432a] shrink-0 mt-0.5" />
                <p className="font-body text-sm text-[#7a2916] text-left leading-snug">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="font-silk w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide
              bg-[#4fae4f] hover:bg-[#63c463] disabled:bg-[#9fcf9f] disabled:cursor-not-allowed
              text-[#0d2818] border-[3px] border-black shadow-[4px_4px_0_0_#000]
              active:shadow-[1px_1px_0_0_#000] active:translate-x-0.75 active:translate-y-0.75
              transition-all duration-100"
            >
              <Gamepad2 className="w-4 h-4" />
              {loading ? "STARTING..." : "START PLAYING"}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t-[3px] border-dashed border-[#d8c6a8] text-center">
            <p className="font-silk text-[9px] text-[#8a7a5f] tracking-wide">
              ARE YOU A TEACHER?
            </p>
            <Link
              to="/teacher/login"
              className="font-silk inline-flex items-center gap-1 text-[10px] text-[#4fae4f] hover:text-[#3a8f3a] mt-2"
            >
              GO TO TEACHER LOGIN
            </Link>
          </div>
        </PixelPanel>

        <div className="flex items-center gap-2 mt-8 text-[#8fbf9a]">
          <TreePine className="w-4 h-4" />
          <span className="font-silk text-[9px] tracking-widest">ELEMATH 2.0</span>
        </div>
      </main>
    </div>
  );
}