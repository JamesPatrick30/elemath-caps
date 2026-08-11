import React, { useState } from "react";
import {
  TreePine,
  Menu,
  X,
  ListChecks,
  ToggleLeft,
  PenLine,
  Target,
  ChevronRight,
  Star,
  Zap,
  Users,
  BookOpen,
  Brain,
  Gamepad2,
  Crown,
  Flame,
  Sparkles,
  Trophy,
  MapPin,
  Bird,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ----------------------------------------------------------------------
   ELEMATH 2.0 — Landing Page
   Direction: 8-bit jungle expedition. Hard pixel-bevel panels (Terraria/
   Minecraft inventory-slot language), a winding "overworld" trail as the
   scroll spine, and a torch-lit palette that stays premium instead of
   preschool: deep canopy greens, dirt browns, ember orange, treasure gold.
   Fonts: "Press Start 2P" for the loudest pixel moments (used sparingly),
   "Silkscreen" for UI/labels, "Inter" for anything meant to be read fast.

   Navigation note: the primary job of this page is getting a student or
   a teacher to their own login as fast and as clearly as possible. Every
   entry point uses two big, color-coded, icon-led buttons (green = student,
   gold = teacher) repeated at the top, middle, and bottom of the page so
   a young reader never has to hunt for it or read fine print to know
   which one is theirs.
------------------------------------------------------------------------- */

const PixelPanel = ({
  children,
  className = "",
  tone = "parchment",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "parchment" | "jungle" | "dirt";
}) => {
  const tones: Record<string, string> = {
    parchment: "bg-[#f6ecd9] border-[#1b120a]",
    jungle: "bg-[#173a24] border-black",
    dirt: "bg-[#8a5a34] border-[#3a2210]",
  };
  return (
    <div
      className={`border-[3px] ${tones[tone]} shadow-[6px_6px_0_0_#000] ${className}`}
    >
      {children}
    </div>
  );
};

const PixelButton = ({
  children,
  variant = "gold",
  icon,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "gold" | "leaf" | "dark";
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const variants: Record<string, string> = {
    gold: "bg-[#f5c542] hover:bg-[#ffd75e] text-[#1b120a] border-black",
    leaf: "bg-[#4fae4f] hover:bg-[#63c463] text-[#0d2818] border-black",
    dark: "bg-[#1b120a] hover:bg-[#2a1c10] text-[#f5c542] border-black",
  };
  return (
    <button
      onClick={onClick}
      className={`font-silk inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm tracking-wide border-[3px] ${variants[variant]}
      shadow-[4px_4px_0_0_#000] active:shadow-[1px_1px_0_0_#000] active:translate-x-0.75 active:translate-y-0.75
      transition-all duration-100 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

const PixelBadgeIcon = ({
  children,
  bg = "#4fae4f",
}: {
  children: React.ReactNode;
  bg?: string;
}) => (
  <div
    className="w-14 h-14 flex items-center justify-center border-[3px] border-black shadow-[3px_3px_0_0_#000]"
    style={{ backgroundColor: bg, imageRendering: "pixelated" }}
  >
    {children}
  </div>
);

/* A big, unmissable pair of "who are you" buttons. Icon + color + short
   word — no reading comprehension required to find the right door. */
const LoginChooser = ({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) => {
  const navigate = useNavigate();
  const big = size === "large";
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <PixelButton
        variant="leaf"
        icon={<Gamepad2 className={big ? "w-6 h-6" : "w-4 h-4"} />}
        className={big ? "!text-base !px-8 !py-5" : ""}
        onClick={() => navigate("/student/login")}
      >
        I'M A STUDENT
      </PixelButton>
      <PixelButton
        variant="gold"
        icon={<BookOpen className={big ? "w-6 h-6" : "w-4 h-4"} />}
        className={big ? "!text-base !px-8 !py-5" : ""}
        onClick={() => navigate("/teacher/login")}
      >
        I'M A TEACHER
      </PixelButton>
    </div>
  );
};

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = ["Quests", "For Teachers", "AI Tools", "Leaderboard"];
  return (
    <header className="sticky top-0 z-50 bg-[#0d2818] border-b-[3px] border-black">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#4fae4f] border-[3px] border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center">
            <TreePine className="w-5 h-5 text-[#0d2818]" strokeWidth={2.5} />
          </div>
          <span className="font-pixel text-[#f5c542] text-[11px] sm:text-sm tracking-wide">
            ELEMATH<span className="text-[#7ecbe8]"> 2.0</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="font-silk text-[11px] tracking-wide text-[#dff2e1] hover:text-[#f5c542] transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <PixelButton
            variant="leaf"
            icon={<Gamepad2 className="w-4 h-4" />}
            className="!px-4 !py-2 !text-[10px]"
            onClick={() => navigate("/student/login")}
          >
            Student Login
          </PixelButton>
          <PixelButton
            variant="gold"
            icon={<BookOpen className="w-4 h-4" />}
            className="!px-4 !py-2 !text-[10px]"
            onClick={() => navigate("/teacher/login")}
          >
            Teacher Login
          </PixelButton>
        </div>

        <button
          className="md:hidden text-[#f5c542]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0d2818] border-t-[3px] border-black px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l} href="#" className="font-silk text-xs text-[#dff2e1]">
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <PixelButton
              variant="leaf"
              icon={<Gamepad2 className="w-4 h-4" />}
              className="!text-[10px] w-full justify-center"
              onClick={() => navigate("/student/login")}
            >
              Student Login
            </PixelButton>
            <PixelButton
              variant="gold"
              icon={<BookOpen className="w-4 h-4" />}
              className="!text-[10px] w-full justify-center"
              onClick={() => navigate("/teacher/login")}
            >
              Teacher Login
            </PixelButton>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a4d2e] via-[#123420] to-[#0d2818] border-b-[3px] border-black">
      {/* pixel cloud blocks */}
      <div className="absolute top-10 left-8 w-16 h-6 bg-[#dff2e1]/80 opacity-70" style={{ clipPath: "polygon(0 40%,20% 40%,20% 0,60% 0,60% 40%,100% 40%,100% 100%,0 100%)" }} />
      <div className="absolute top-24 right-16 w-20 h-7 bg-[#dff2e1]/60 opacity-60" style={{ clipPath: "polygon(0 40%,20% 40%,20% 0,60% 0,60% 40%,100% 40%,100% 100%,0 100%)" }} />

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

      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0d2818] border-[3px] border-[#f5c542] px-3 py-1 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#f5c542]" />
            <span className="font-silk text-[9px] text-[#f5c542] tracking-widest">
              AI-POWERED QUEST BUILDER
            </span>
          </div>

          <h1 className="font-pixel text-[#f6ecd9] text-2xl sm:text-3xl md:text-4xl leading-relaxed">
            LEVEL UP
            <br />
            <span className="text-[#f5c542]">ELEMENTARY MATH</span>
          </h1>

          <p className="font-body text-[#c9e4cf] text-base sm:text-lg mt-6 max-w-md leading-relaxed">
            An 8-bit jungle expedition for grades 1–6. Teachers spawn AI-built
            quizzes in minutes; students earn XP, badges and leaderboard rank
            for every problem they clear.
          </p>

          <p className="font-silk text-[9px] text-[#8fbf9a] tracking-widest mt-8 mb-3">
            &gt; PICK YOUR CHARACTER TO BEGIN
          </p>
          <LoginChooser size="large" />
        </div>

        {/* pixel scene: floating quiz card + creatures */}
        <div className="relative h-80 hidden md:block">
          <PixelPanel tone="parchment" className="absolute top-6 left-6 w-64 p-5 animate-[float_4s_ease-in-out_infinite]">
            <p className="font-silk text-[10px] text-[#1b120a] mb-3">QUESTION 4 / 10</p>
            <p className="font-body text-sm text-[#1b120a] mb-4">7 × 8 = ?</p>
            <div className="grid grid-cols-2 gap-2">
              {["54", "56", "63", "48"].map((n, i) => (
                <div
                  key={n}
                  className={`font-silk text-[10px] text-center py-2 border-[2px] border-black ${
                    i === 1 ? "bg-[#4fae4f] text-white" : "bg-white"
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>
          </PixelPanel>

          <div className="absolute bottom-2 right-4 animate-[float_3s_ease-in-out_infinite_0.5s]">
            <PixelBadgeIcon bg="#f5c542">
              <Crown className="w-6 h-6 text-[#1b120a]" />
            </PixelBadgeIcon>
          </div>
          <div className="absolute top-2 right-0 animate-[float_5s_ease-in-out_infinite_0.2s]">
            <PixelBadgeIcon bg="#7ecbe8">
              <Bird className="w-6 h-6 text-[#0d2818]" />
            </PixelBadgeIcon>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { icon: <Users />, value: "40,000+", label: "Student Explorers" },
    { icon: <BookOpen />, value: "3,200+", label: "Teachers Onboard" },
    { icon: <Zap />, value: "12M", label: "XP Earned" },
    { icon: <Flame />, value: "94%", label: "Weekly Streak Rate" },
  ];
  return (
    <section className="bg-[#0a2015] border-b-[3px] border-black">
      <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center gap-2">
            <div className="text-[#f5c542]">{s.icon}</div>
            <span className="font-pixel text-[#f6ecd9] text-sm">{s.value}</span>
            <span className="font-silk text-[8px] text-[#8fbf9a] tracking-wide">
              {s.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuestTypes() {
  const quests = [
    {
      icon: <ListChecks className="w-7 h-7" />,
      title: "Multiple Choice",
      desc: "4-choice item slots. Fast to answer, easy to auto-grade, built for AI generation.",
      bg: "#4fae4f",
    },
    {
      icon: <ToggleLeft className="w-7 h-7" />,
      title: "True or False",
      desc: "One quick call. Great warm-up rounds before a boss-level quiz.",
      bg: "#7ecbe8",
    },
    {
      icon: <PenLine className="w-7 h-7" />,
      title: "Fill in the Blank",
      desc: "Type the missing piece. Rewards recall over recognition.",
      bg: "#f5c542",
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Identification",
      desc: "Name it outright. The final check before a topic is marked cleared.",
      bg: "#ff7a3d",
    },
  ];
  return (
    <section className="bg-[#123420] py-20 border-b-[3px] border-black">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="font-silk text-[10px] text-[#f5c542] tracking-widest mb-3">
            &gt; CHOOSE YOUR QUEST TYPE
          </p>
          <h2 className="font-pixel text-[#f6ecd9] text-xl sm:text-2xl leading-relaxed">
            FOUR WAYS TO TEST
            <br /> WHAT STUDENTS KNOW
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quests.map((q) => (
            <PixelPanel key={q.title} tone="parchment" className="p-6 hover:-translate-y-1 transition-transform duration-150">
              <PixelBadgeIcon bg={q.bg}>
                <span className="text-[#1b120a]">{q.icon}</span>
              </PixelBadgeIcon>
              <h3 className="font-silk text-[12px] text-[#1b120a] mt-5 mb-2">
                {q.title}
              </h3>
              <p className="font-body text-[13px] text-[#4a3524] leading-relaxed">
                {q.desc}
              </p>
            </PixelPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyPath() {
  const steps = [
    { label: "Teacher Uploads Lesson", icon: <BookOpen className="w-5 h-5" /> },
    { label: "AI Builds the Quiz", icon: <Brain className="w-5 h-5" /> },
    { label: "Students Explore & Answer", icon: <Gamepad2 className="w-5 h-5" /> },
    { label: "XP, Badges & Rank", icon: <Trophy className="w-5 h-5" /> },
  ];
  return (
    <section className="relative bg-[#1a4d2e] py-24 border-b-[3px] border-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-silk text-[10px] text-[#f5c542] tracking-widest mb-3">
            &gt; THE OVERWORLD MAP
          </p>
          <h2 className="font-pixel text-[#f6ecd9] text-xl sm:text-2xl">
            HOW ELEMATH WORKS
          </h2>
        </div>

        {/* dotted trail */}
        <div
          className="hidden md:block absolute left-0 right-0 top-[188px] h-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #f5c542 0 14px, transparent 14px 26px)",
          }}
        />

        <div className="grid md:grid-cols-4 gap-10 relative">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="font-silk text-[9px] text-[#8fbf9a] mb-3">
                WAYPOINT {i + 1}
              </span>
              <div className="w-16 h-16 bg-[#f6ecd9] border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-[#1b120a] relative z-10">
                {s.icon}
              </div>
              <MapPin className="w-4 h-4 text-[#f5c542] mt-2" />
              <p className="font-silk text-[10px] text-[#dff2e1] mt-2 max-w-[140px] leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: <Brain />,
      title: "AI Lesson Generator",
      desc: "Upload a PDF, slide deck, or photo of a worksheet. Get an editable quiz back in seconds, sorted by difficulty and topic.",
    },
    {
      icon: <Gamepad2 />,
      title: "One-Tap Live Quiz",
      desc: "No room codes. Students join a live session with a single tap from a shared link and land straight in the jungle lobby.",
    },
    {
      icon: <Trophy />,
      title: "Jungle Leaderboard",
      desc: "Gold, silver, and bronze wooden platforms, animated rank changes, streaks, and XP that carries across every quiz.",
    },
    {
      icon: <BookOpen />,
      title: "Real Gradebook",
      desc: "Quiz, assignment, and exam scores roll up into quarterly averages, exportable as report cards in one click.",
    },
  ];
  return (
    <section className="bg-[#0d2818] py-20 border-b-[3px] border-black">
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-6">
        {items.map((f) => (
          <PixelPanel key={f.title} tone="jungle" className="p-6 flex gap-5">
            <div className="w-12 h-12 shrink-0 bg-[#f5c542] border-[3px] border-black flex items-center justify-center text-[#1b120a]">
              {f.icon}
            </div>
            <div>
              <h3 className="font-silk text-[12px] text-[#f6ecd9] mb-2">{f.title}</h3>
              <p className="font-body text-[13px] text-[#b9d8c1] leading-relaxed">
                {f.desc}
              </p>
            </div>
          </PixelPanel>
        ))}
      </div>
    </section>
  );
}

function LeaderboardPreview() {
  const podium = [
    { rank: 2, name: "Maya", xp: "8,120", h: "h-24", bg: "#c7c7c7" },
    { rank: 1, name: "Jaro", xp: "9,450", h: "h-32", bg: "#f5c542" },
    { rank: 3, name: "Bea", xp: "7,660", h: "h-20", bg: "#c98a4b" },
  ];
  return (
    <section className="bg-[#123420] py-20 border-b-[3px] border-black">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <p className="font-silk text-[10px] text-[#f5c542] tracking-widest mb-3">
          &gt; THIS WEEK'S EXPEDITION
        </p>
        <h2 className="font-pixel text-[#f6ecd9] text-xl sm:text-2xl mb-14">
          TOP EXPLORERS
        </h2>

        <div className="flex items-end justify-center gap-6">
          {[podium[0], podium[1], podium[2]].map((p) => (
            <div key={p.rank} className="flex flex-col items-center">
              <Star className="w-5 h-5 text-[#f5c542] mb-2" />
              <div className="w-14 h-14 bg-[#f6ecd9] border-[3px] border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-[#1b120a]" />
              </div>
              <span className="font-silk text-[10px] text-[#f6ecd9]">{p.name}</span>
              <span className="font-silk text-[8px] text-[#8fbf9a] mb-2">{p.xp} XP</span>
              <div
                className={`w-24 ${p.h} border-[3px] border-black flex items-start justify-center pt-2`}
                style={{ backgroundColor: p.bg }}
              >
                <span className="font-pixel text-sm text-[#1b120a]">{p.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="bg-gradient-to-b from-[#173a24] to-[#0a2015] py-20">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <PixelBadgeIcon bg="#f5c542">
          <Sparkles className="w-6 h-6 text-[#1b120a] mx-auto" />
        </PixelBadgeIcon>
        <h2 className="font-pixel text-[#f6ecd9] text-xl sm:text-2xl mt-8 mb-4 leading-relaxed">
          READY TO OPEN THE
          <br /> TREASURE CHEST?
        </h2>
        <p className="font-body text-[#c9e4cf] text-base max-w-md mx-auto mb-8">
          Jump back into your classroom. Pick the door that's yours below.
        </p>
        <div className="flex justify-center">
          <LoginChooser size="large" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#0a2015] border-t-[3px] border-black py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4fae4f] border-[3px] border-black flex items-center justify-center">
            <TreePine className="w-4 h-4 text-[#0d2818]" />
          </div>
          <span className="font-pixel text-[#f5c542] text-[10px]">ELEMATH 2.0</span>
        </div>
        <p className="font-silk text-[9px] text-[#8fbf9a] text-center">
          © {new Date().getFullYear()} ELEMATH. BUILT FOR EXPLORERS GRADE 1–6.
        </p>
        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="font-silk text-[9px] text-[#dff2e1] hover:text-[#f5c542]">
              {l}
            </a>
          ))}
          <button
            className="font-silk text-[9px] text-[#f5c542] hover:text-[#ffd75e] inline-flex items-center gap-1"
            onClick={() => navigate("/teacher/login")}
          >
            Teacher Login <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d2818]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-silk { font-family: 'Silkscreen', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
        * { image-rendering: pixelated; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <Navbar />
      <Hero />
      <StatsStrip />
      <QuestTypes />
      <JourneyPath />
      <Features />
      <LeaderboardPreview />
      <CTABanner />
      <Footer />
    </div>
  );
}