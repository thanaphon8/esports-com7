"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chakra_Petch, Barlow } from "next/font/google";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

/* ------------------------------------------------------------------ */
/*  DATA  (แก้ข้อมูล / ใส่รูปจริงได้ที่นี่)                              */
/* ------------------------------------------------------------------ */

const NAV = ["Home", "About", "Team", "Ranking", "Play", "Shop", "Pages"];
const SLIDE_MS = 7000;

const SLIDES = [
  {
    title: "About Dragon Esports Team",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et quis odio vestibulum nunc, neque integer purus.",
    cta: "Meet the team",
    href: "#team",
    image: "",
  },
  {
    title: "Champions of the Arena",
    text: "Three-time regional champions with players who train every day to compete at the highest level.",
    cta: "See achievements",
    href: "#achievements",
    image: "",
  },
  {
    title: "Join the Dragon Army",
    text: "Get the latest jerseys, match updates and behind-the-scenes content from the team.",
    cta: "Visit the shop",
    href: "#shop",
    image: "",
  },
  {
    title: "Play. Score. Rank up.",
    text: "Jump into our mini games, collect points and see where you land on the player ranking.",
    cta: "Play now",
    href: "#play",
    image: "",
  },
];

const STATS = [
  { to: 12, decimals: 0, suffix: "", label: "Tournament wins" },
  { to: 48, decimals: 0, suffix: "", label: "Pro players" },
  { to: 2.4, decimals: 1, suffix: "M", label: "Followers" },
  { to: 9, decimals: 0, suffix: "", label: "Games" },
];

const PLAYERS = [
  { name: "Kaito 'Viper' Tanaka", role: "Team captain", game: "Valorant", color: "#2bff88" },
  { name: "Arthit 'Nova' Suwan", role: "Entry fragger", game: "Valorant", color: "#7dff4f" },
  { name: "Lena 'Frost' Moreau", role: "Support", game: "League of Legends", color: "#19e6a0" },
  { name: "Min-jun 'Rift' Park", role: "Mid laner", game: "League of Legends", color: "#2bff88" },
  { name: "Dmitri 'Ghost' Volkov", role: "AWPer", game: "CS2", color: "#7dff4f" },
  { name: "Sara 'Blaze' Ortiz", role: "In-game leader", game: "CS2", color: "#19e6a0" },
];

const MATCHES = [
  { date: "Oct 12", time: "19:00", game: "Valorant", vs: "Shadow Wolves", event: "Pacific Cup" },
  { date: "Oct 15", time: "21:30", game: "CS2", vs: "Iron Phoenix", event: "Masters Qualifier" },
  { date: "Oct 19", time: "18:00", game: "League of Legends", vs: "Neon Tigers", event: "Summer Split" },
  { date: "Oct 26", time: "20:00", game: "Valorant", vs: "Void Syndicate", event: "Champions Stage" },
];

const ACHIEVEMENTS = [
  { year: "2026", title: "Pacific Cup", place: "1st place", prize: "$120,000" },
  { year: "2025", title: "Masters Series", place: "1st place", prize: "$80,000" },
  { year: "2025", title: "World Qualifier", place: "2nd place", prize: "$45,000" },
  { year: "2024", title: "Regional League", place: "1st place", prize: "$30,000" },
];

const PARTNERS = ["NEXUS", "VOLT", "HYPERION", "ARCADIA", "QUANTUM", "ZENITH"];

const PRODUCTS = [
  { name: "Dragon Pro Jersey", price: "$59.00", tag: "New" },
  { name: "Team Hoodie", price: "$74.00", tag: "" },
  { name: "Esports Cap", price: "$29.00", tag: "" },
  { name: "Pro Mousepad XL", price: "$24.00", tag: "Sale" },
];

const NEWS = [
  {
    title: "Dragon wins the Pacific Cup after a five-map thriller",
    date: "Oct 02, 2026",
    cat: "Match report",
  },
  {
    title: "Meet our new roster for the upcoming season",
    date: "Sep 24, 2026",
    cat: "Team news",
  },
  {
    title: "Limited edition jersey drops this Friday",
    date: "Sep 18, 2026",
    cat: "Merch",
  },
];

/* ------------------------------------------------------------------ */
/*  EFFECT HELPERS                                                     */
/* ------------------------------------------------------------------ */

type RevealVariant = "up" | "left" | "right" | "zoom" | "wipe";

function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setVal(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ClickFx() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const id = ++idRef.current;
      setBursts((b) => [...b.slice(-6), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setBursts((b) => b.filter((k) => k.id !== id)), 750);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          <span className="fx-ring" />
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="fx-shard"
              style={{ "--a": `${i * 45}deg` } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <a href="#home" className="group flex items-center gap-3">
      <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(43,255,136,0.8)]"
      >
        <path
          d="M20 1 38 11v22L20 43 2 33V11z"
          fill="#0a1014"
          stroke="#2bff88"
          strokeWidth="1.5"
        />
        <path d="M11 30 14 14l6 6 6-6 3 16-9-5z" fill="#ff2a55" />
        <path d="M16 22l4 3 4-3" stroke="#0a1014" strokeWidth="1.5" fill="none" />
      </svg>
      <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-white">
        ESPORTS
      </span>
    </a>
  );
}

function Button({
  children,
  href,
  onClick,
  variant = "solid",
  type = "button",
  fullWidth = false,
  disabled = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  const base =
    "btn-fx relative inline-flex -skew-x-12 items-center justify-center overflow-hidden px-7 py-3.5 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wider transition-all active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_22px_rgba(43,255,136,0.45)] hover:bg-[#6bffaa] hover:shadow-[0_0_34px_rgba(43,255,136,0.7)]"
      : "border border-white/30 text-white hover:border-[#2bff88] hover:text-[#2bff88] hover:shadow-[0_0_18px_rgba(43,255,136,0.3)]";

  const widthClass = fullWidth ? "w-full" : "";

  const inner = (
    <>
      <span className="btn-shine" aria-hidden="true" />
      <span className="relative inline-block skew-x-12">{children}</span>
    </>
  );

  if (onClick || type === "submit") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${styles} ${widthClass}`}
      >
        {inner}
      </button>
    );
  }
  return (
    <a href={href ?? "#"} className={`${base} ${styles} ${widthClass}`}>
      {inner}
    </a>
  );
}

function SectionHead({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="bar-grow mb-5 block h-1.5 -skew-x-12 bg-[#2bff88] shadow-[0_0_14px_#2bff88]" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight text-white [text-shadow:0_0_26px_rgba(43,255,136,0.35)] sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-lg text-[#8fa6a1]">{intro}</p>}
        </div>
        {action}
      </div>
    </Reveal>
  );
}

function HeroVisual({ image, index }: { image: string; index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2bff88]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover mix-blend-multiply grayscale contrast-125"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#b9ffd8_0%,#2bff88_35%,#03301a_100%)]" />
          <svg
            className="absolute inset-0 h-full w-full opacity-30"
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {Array.from({ length: 7 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <path
                  key={`${r}-${c}`}
                  d="M0-30 26-15v30L0 30-26 15v-30z"
                  transform={`translate(${c * 78 + (r % 2) * 39} ${r * 68})`}
                  fill="none"
                  stroke="#0a1014"
                  strokeWidth="1.5"
                />
              ))
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-[family-name:var(--font-display)] text-[9rem] font-bold leading-none text-[#0a1014]/40 sm:text-[12rem]">
              {["VR", "GG", "01"][index % 3]}
            </span>
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05080a] via-transparent to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AUTH MODAL (LOGIN & REGISTER)                                      */
/* ------------------------------------------------------------------ */

function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSubmitAuth,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onSubmitAuth: (
    mode: "login" | "register",
    data: { username: string; email: string; password: string }
  ) => Promise<string | null>; // คืน error message หรือ null ถ้าสำเร็จ
}) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!email || !password) return setError("Please fill in all fields");
    } else {
      if (!username || !email || !password || !confirmPassword)
        return setError("Please fill in all fields");
      if (password !== confirmPassword) return setError("Passwords do not match");
    }

    setLoading(true);
    const err = await onSubmitAuth(mode, { username, email, password });
    setLoading(false);
    if (err) return setError(err);
    setPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="fx-pop relative z-10 w-full max-w-md overflow-hidden border border-[#2bff88]/40 bg-[#0a1014] p-8 shadow-[0_0_50px_rgba(43,255,136,0.2)]">
        {/* Glow Header Accent */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ff2a55] via-[#2bff88] to-[#ff2a55]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 transition-colors hover:text-[#2bff88]"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <div className="mb-6 text-center">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-wider text-white">
            {mode === "login" ? "Welcome Back" : "Join the Army"}
          </h3>
          <p className="mt-1 text-sm text-[#8fa6a1]">
            {mode === "login"
              ? "Access your Dragon Esports account"
              : "Create an account to start ranking up"}
          </p>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="mb-6 flex border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === "login"
                ? "border-b-2 border-[#2bff88] text-[#2bff88]"
                : "text-white/50 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-2 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === "register"
                ? "border-b-2 border-[#2bff88] text-[#2bff88]"
                : "text-white/50 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 border border-[#ff2a55]/40 bg-[#ff2a55]/10 p-3 text-center text-xs text-[#ff2a55]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[#8fa6a1]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="DragonRider99"
                className="h-11 w-full border border-white/15 bg-[#05080a] px-4 text-white placeholder:text-white/30 focus-visible:border-[#2bff88] focus-visible:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[#8fa6a1]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@esports.com"
              className="h-11 w-full border border-white/15 bg-[#05080a] px-4 text-white placeholder:text-white/30 focus-visible:border-[#2bff88] focus-visible:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[#8fa6a1]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full border border-white/15 bg-[#05080a] px-4 text-white placeholder:text-white/30 focus-visible:border-[#2bff88] focus-visible:outline-none"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[#8fa6a1]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full border border-white/15 bg-[#05080a] px-4 text-white placeholder:text-white/30 focus-visible:border-[#2bff88] focus-visible:outline-none"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="text-right">
              <a href="#" className="text-xs text-[#8fa6a1] hover:text-[#2bff88]">
                Forgot password?
              </a>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" fullWidth variant="solid" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-[#8fa6a1]">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-[#2bff88] underline hover:text-[#6bffaa]"
              >
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-[#2bff88] underline hover:text-[#6bffaa]"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RANKING + MINI GAMES                                               */
/* ------------------------------------------------------------------ */

type GameKey = "aim" | "memory";
type Tab = "total" | GameKey;
type Player = {
  name: string;
  country: string;
  total: number;
  aim: number;
  memory: number;
  plays: number;
};
type Result = { name: string; game: GameKey; score: number; rank: number };

const TABS: { key: Tab; label: string; unit: string }[] = [
  { key: "total", label: "Overall", unit: "Total points" },
  { key: "aim", label: "Aim Trainer", unit: "Best score" },
  { key: "memory", label: "Memory Match", unit: "Best score" },
];

const GAMES: Record<GameKey, { name: string; desc: string; rules: string[] }> = {
  aim: {
    name: "Aim Trainer",
    desc: "Hit as many targets as you can in 30 seconds.",
    rules: [
      "Each hit gives 10 points",
      "Hit in a row for up to +10 combo bonus",
      "A miss costs 5 points and resets the combo",
    ],
  },
  memory: {
    name: "Memory Match",
    desc: "Flip the cards and find all 8 pairs.",
    rules: [
      "You start with 1,000 points",
      "Each extra move costs 25 points",
      "Each second costs 6 points (minimum 100)",
    ],
  },
};

const fmt = (n: number) => n.toLocaleString("en-US");

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  const colors = ["#2bff88", "#19e6a0", "#7dff4f", "#00e5a8", "#a3ff6b", "#ff2a55"];
  return colors[h % colors.length];
}

function Avatar({ name, size = 40, dark = false }: { name: string; size?: number; dark?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] font-bold uppercase ${
        dark ? "border-2 border-white text-white" : "text-[#04110a]"
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: dark ? "#05080a" : avatarColor(name),
      }}
    >
      {name.charAt(0)}
    </span>
  );
}

function PodiumCard({
  p,
  rank,
  value,
  unit,
  me,
  fx,
}: {
  p: Player;
  rank: number;
  value: number;
  unit: string;
  me: boolean;
  fx: boolean;
}) {
  const first = rank === 1;
  const height = rank === 1 ? "md:h-[350px]" : rank === 2 ? "md:h-[300px]" : "md:h-[270px]";
  const order = rank === 1 ? "md:order-2" : rank === 2 ? "md:order-1" : "md:order-3";
  return (
    <div
      style={fx ? { animationDelay: `${(rank - 1) * 90}ms` } : undefined}
      className={`relative flex flex-col items-center justify-center px-6 py-10 text-center transition-transform duration-300 hover:-translate-y-1 ${height} ${order} ${fx ? "fx-rise" : ""} ${
        first ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_60px_rgba(43,255,136,0.55)]" : "border border-[#2bff88]/25 bg-[#05080a] hover:border-[#2bff88]"
      } ${me ? "outline outline-2 outline-offset-4 outline-white" : ""}`}
    >
      <div
        className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center font-[family-name:var(--font-display)] text-2xl font-bold ${
          first ? "bg-[#05080a] text-white" : "bg-[#2bff88] text-[#04110a]"
        }`}
      >
        {rank}
      </div>
      {first && (
        <svg width="36" height="28" viewBox="0 0 36 28" className="mb-3" aria-hidden="true">
          <path d="M2 24 5 6l9 9 4-12 4 12 9-9 3 18z" fill="#04110a" />
        </svg>
      )}
      <Avatar name={p.name} size={first ? 88 : 72} dark={first} />
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold">{p.name}</h3>
      <p className={first ? "text-[#04110a]/70" : "text-[#8fa6a1]"}>{p.country}</p>
      <div className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold">
        {fmt(value)}
      </div>
      <div className={`text-sm ${first ? "text-[#04110a]/70" : "text-[#8fa6a1]"}`}>{unit}</div>
    </div>
  );
}

function Leaderboard({
  players,
  tab,
  onTab,
  meName,
}: {
  players: Player[];
  tab: Tab;
  onTab: (t: Tab) => void;
  meName: string;
}) {
  const [touched, setTouched] = useState(false);
  const ranked = useMemo(
    () =>
      players
        .filter((p) => tab === "total" || p[tab] > 0)
        .sort((a, b) => b[tab] - a[tab]),
    [players, tab]
  );
  const unit = TABS.find((t) => t.key === tab)!.unit;
  const isMe = (n: string) => !!meName && n.toLowerCase() === meName.toLowerCase();
  const meIdx = ranked.findIndex((p) => isMe(p.name));
  const rest = ranked.slice(3, 10);

  const renderRow = (p: Player, rank: number) => (
    <div
      style={touched ? { animationDelay: `${Math.min(rank - 4, 8) * 55}ms` } : undefined}
      className={`grid grid-cols-[48px_1fr_auto] items-center gap-4 border-l-4 px-4 py-4 transition-all duration-200 hover:translate-x-1 md:grid-cols-[64px_1fr_100px_100px_140px] ${
        touched ? "fx-rise" : ""
      } ${
        isMe(p.name) ? "border-[#2bff88] bg-[#2bff88]/15" : "border-transparent hover:border-[#2bff88]/60 hover:bg-white/[0.03]"
      }`}
    >
      <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#8fa6a1]">
        {rank}
      </span>
      <span className="flex items-center gap-3">
        <Avatar name={p.name} />
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
          {p.name}
          {isMe(p.name) && <span className="ml-2 text-sm text-[#2bff88]">You</span>}
        </span>
      </span>
      <span className="hidden text-[#8fa6a1] md:block">{p.country}</span>
      <span className="hidden text-[#8fa6a1] md:block">{p.plays}</span>
      <span className="text-right font-[family-name:var(--font-display)] text-xl font-bold">
        {fmt(p[tab])}
      </span>
    </div>
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Ranking type">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              setTouched(true);
              onTab(t.key);
            }}
            className={`px-5 py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
              tab === t.key
                ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_18px_rgba(43,255,136,0.4)]"
                : "border border-white/20 text-white hover:border-[#2bff88] hover:shadow-[0_0_14px_rgba(43,255,136,0.25)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <p className="border border-white/10 p-10 text-center text-[#8fa6a1]">
          No scores yet. Play a game below to be the first on the board.
        </p>
      ) : (
        <div key={tab}>
          <div className="grid items-end gap-4 md:grid-cols-3">
            {ranked.slice(0, 3).map((p, i) => (
              <PodiumCard
                key={p.name}
                p={p}
                rank={i + 1}
                value={p[tab]}
                unit={unit}
                me={isMe(p.name)}
                fx={touched}
              />
            ))}
          </div>

          {rest.length > 0 && (
            <div className="mt-10 border border-white/10 bg-[#05080a]">
              <div className="hidden grid-cols-[64px_1fr_100px_100px_140px] gap-4 border-b border-white/10 px-4 py-3 pl-5 text-sm text-[#8fa6a1] md:grid">
                <span>Rank</span>
                <span>Player</span>
                <span>Country</span>
                <span>Games</span>
                <span className="text-right">{unit}</span>
              </div>
              <div className="divide-y divide-white/10">
                {rest.map((p, i) => (
                  <div key={p.name}>{renderRow(p, i + 4)}</div>
                ))}
                {meIdx >= 10 && (
                  <>
                    <div className="px-4 py-2 text-center text-[#8fa6a1]">...</div>
                    {renderRow(ranked[meIdx], meIdx + 1)}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HudStat({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string | number;
  warn?: boolean;
}) {
  return (
    <div
      className={`flex-1 border bg-[#0a1014] px-4 py-3 transition-colors ${
        warn ? "animate-[pulseWarn_1s_infinite] border-[#ff2a55] text-[#ff2a55]" : "border-white/10"
      }`}
    >
      <div className="text-sm text-[#8fa6a1]">{label}</div>
      <div className="font-[family-name:var(--font-display)] text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ---------------- Mini game 1: Aim Trainer ---------------- */
type Float = { id: number; x: number; y: number; text: string; bad: boolean };

function AimTrainer({ onFinish }: { onFinish: (score: number) => void }) {
  const DURATION = 30;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [floats, setFloats] = useState<Float[]>([]);
  const [shake, setShake] = useState(false);
  const scoreRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setTime((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && time <= 0) {
      setPhase("done");
      onFinish(scoreRef.current);
    }
  }, [time, phase, onFinish]);

  const addFloat = (x: number, y: number, text: string, bad = false) => {
    const id = ++idRef.current;
    setFloats((f) => [...f.slice(-8), { id, x, y, text, bad }]);
    setTimeout(() => setFloats((f) => f.filter((k) => k.id !== id)), 700);
  };

  const moveTarget = () =>
    setPos({ x: 8 + Math.random() * 84, y: 12 + Math.random() * 76 });

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setCombo(0);
    setHits(0);
    setMisses(0);
    setTime(DURATION);
    setFloats([]);
    moveTarget();
    setPhase("playing");
  };

  const hit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "playing") return;
    const gain = 10 + Math.min(combo, 10);
    scoreRef.current += gain;
    setScore(scoreRef.current);
    setCombo((c) => c + 1);
    setHits((h) => h + 1);
    addFloat(pos.x, pos.y, `+${gain}`);
    moveTarget();
  };

  const miss = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "playing") return;
    const r = e.currentTarget.getBoundingClientRect();
    addFloat(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100, "-5", true);
    scoreRef.current = Math.max(0, scoreRef.current - 5);
    setScore(scoreRef.current);
    setCombo(0);
    setMisses((m) => m + 1);
    setShake(true);
    setTimeout(() => setShake(false), 260);
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex gap-3">
        <HudStat label="Time" value={`${Math.max(time, 0)}s`} warn={phase === "playing" && time <= 5} />
        <HudStat label="Score" value={score} />
        <HudStat label="Combo" value={`x${combo}`} />
        <HudStat label="Hits" value={hits} />
      </div>
      <div
        onClick={miss}
        className={`relative h-[380px] cursor-crosshair select-none overflow-hidden border border-white/10 bg-[#0a1014] bg-[radial-gradient(circle_at_center,#101a1f_0%,#0a1014_70%)] ${
          shake ? "fx-shake" : ""
        }`}
      >
        {phase === "playing" && (
          <button
            onClick={hit}
            aria-label="Target"
            className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-[#ff2a55] shadow-[0_0_0_6px_rgba(255,42,85,0.25),0_0_28px_rgba(255,42,85,0.8)] transition-transform hover:scale-110 active:scale-90"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <span className="h-6 w-6 rounded-full border-4 border-white" />
            <span className="absolute h-2 w-2 rounded-full bg-white" />
          </button>
        )}

        {floats.map((f) => (
          <div
            key={f.id}
            className="pointer-events-none absolute"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {!f.bad && <span className="fx-ring" />}
            <span
              className={`fx-float absolute left-0 top-0 font-[family-name:var(--font-display)] text-xl font-bold ${
                f.bad ? "text-[#ff2a55]" : "text-[#2bff88]"
              }`}
            >
              {f.text}
            </span>
          </div>
        ))}

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05080a]/90 p-6 text-center">
            {phase === "idle" ? (
              <>
                <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase">
                  Aim Trainer
                </h3>
                <p className="mt-3 max-w-sm text-[#8fa6a1]">
                  Click the targets as fast as you can. You have {DURATION} seconds.
                </p>
              </>
            ) : (
              <>
                <div className="text-[#8fa6a1]">Final score</div>
                <div className="fx-rise font-[family-name:var(--font-display)] text-6xl font-bold text-[#2bff88] [text-shadow:0_0_24px_rgba(43,255,136,0.6)]">
                  {score}
                </div>
                <p className="mt-2 text-[#8fa6a1]">
                  {hits} hits, {misses} misses, {accuracy}% accuracy
                </p>
              </>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={start}>{phase === "idle" ? "Start game" : "Play again"}</Button>
              {phase === "done" && (
                <Button href="#ranking" variant="outline">View ranking</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Mini game 2: Memory Match ---------------- */
type MemCard = { sym: string; open: boolean; done: boolean };
const SYMBOLS = ["🐉", "⚔️", "🎮", "🏆", "🔥", "💎", "🎯", "⚡"];

function MemoryMatch({ onFinish }: { onFinish: (score: number) => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [cards, setCards] = useState<MemCard[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setTime((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && cards.length > 0 && cards.every((c) => c.done)) {
      const final = Math.max(100, 1000 - Math.max(0, moves - 8) * 25 - time * 6);
      setScore(final);
      setPhase("done");
      onFinish(final);
    }
  }, [cards, phase, moves, time, onFinish]);

  const start = () => {
    const deck = [...SYMBOLS, ...SYMBOLS].map((sym) => ({ sym, open: false, done: false }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setSel([]);
    setLock(false);
    setMoves(0);
    setTime(0);
    setPhase("playing");
  };

  const flip = (i: number) => {
    if (phase !== "playing" || lock || cards[i].open || cards[i].done) return;
    const next = cards.map((c, k) => (k === i ? { ...c, open: true } : c));
    const picked = [...sel, i];
    setCards(next);
    if (picked.length < 2) {
      setSel(picked);
      return;
    }
    const [a, b] = picked;
    setMoves((m) => m + 1);
    setLock(true);
    const match = next[a].sym === next[b].sym;
    setTimeout(
      () => {
        setCards((cs) =>
          cs.map((c, k) =>
            k === a || k === b ? (match ? { ...c, done: true } : { ...c, open: false }) : c
          )
        );
        setSel([]);
        setLock(false);
      },
      match ? 300 : 700
    );
  };

  const pairs = cards.filter((c) => c.done).length / 2;

  return (
    <div>
      <div className="mb-3 flex gap-3">
        <HudStat label="Time" value={`${time}s`} />
        <HudStat label="Moves" value={moves} />
        <HudStat label="Pairs" value={`${pairs}/8`} />
      </div>
      <div className="relative flex h-[380px] items-center justify-center overflow-hidden border border-white/10 bg-[#0a1014] p-4">
        {cards.length > 0 && (
          <div className="grid h-full max-h-[350px] grid-cols-4 gap-2 sm:gap-3" style={{ aspectRatio: "1 / 1" }}>
            {cards.map((c, i) => (
              <button
                key={i}
                onClick={() => flip(i)}
                aria-label={c.open || c.done ? c.sym : "Hidden card"}
                className={`flex items-center justify-center text-3xl transition-colors active:scale-95 sm:text-4xl ${
                  c.done
                    ? "fx-match bg-[#2bff88]/25 ring-1 ring-[#2bff88]"
                    : c.open
                    ? "fx-pop bg-[#2bff88]"
                    : "bg-[#101a1f] hover:bg-[#17252c] hover:shadow-[0_0_14px_rgba(43,255,136,0.25)]"
                }`}
              >
                {c.open || c.done ? (
                  c.sym
                ) : (
                  <span className="font-[family-name:var(--font-display)] text-lg text-white/20">?</span>
                )}
              </button>
            ))}
          </div>
        )}

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05080a]/90 p-6 text-center">
            {phase === "idle" ? (
              <>
                <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase">
                  Memory Match
                </h3>
                <p className="mt-3 max-w-sm text-[#8fa6a1]">
                  Find all 8 pairs with as few moves and as little time as possible.
                </p>
              </>
            ) : (
              <>
                <div className="text-[#8fa6a1]">Final score</div>
                <div className="fx-rise font-[family-name:var(--font-display)] text-6xl font-bold text-[#2bff88] [text-shadow:0_0_24px_rgba(43,255,136,0.6)]">
                  {score}
                </div>
                <p className="mt-2 text-[#8fa6a1]">
                  Finished in {moves} moves and {time} seconds
                </p>
              </>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={start}>{phase === "idle" ? "Start game" : "Play again"}</Button>
              {phase === "done" && (
                <Button href="#ranking" variant="outline">View ranking</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayZone({
  nick,
  loggedIn,
  game,
  onGame,
  result,
  onFinish,
}: {
  nick: string;
  loggedIn: boolean;
  game: GameKey;
  onGame: (g: GameKey) => void;
  result: Result | null;
  onFinish: (score: number) => void;
}) {
  const g = GAMES[game];
  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="space-y-6">
        <div>
          <label htmlFor="nick" className="mb-2 block font-medium">
            Your nickname
          </label>
          <input
            id="nick"
            value={nick}
            readOnly
            placeholder="Log in to save your score"
            className="h-12 w-full cursor-not-allowed border border-white/20 bg-[#0a1014] px-4 text-white/80 placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2bff88]"
          />
          <p className="mt-2 text-sm text-[#8fa6a1]">
            {loggedIn
              ? "Scores are saved under your account name."
              : "Log in to have your scores saved to the ranking."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(GAMES) as GameKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onGame(k)}
              aria-pressed={game === k}
              className={`p-4 text-left transition-all active:scale-95 ${
                game === k
                  ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_20px_rgba(43,255,136,0.4)]"
                  : "border border-white/15 bg-[#0a1014] hover:border-[#2bff88]"
              }`}
            >
              <div className="font-[family-name:var(--font-display)] text-lg font-semibold">
                {GAMES[k].name}
              </div>
            </button>
          ))}
        </div>

        <div key={game} className="fx-rise border border-white/10 bg-[#0a1014] p-6">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">{g.name}</h3>
          <p className="mt-2 text-[#8fa6a1]">{g.desc}</p>
          <ul className="mt-4 space-y-2">
            {g.rules.map((r) => (
              <li key={r} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 bg-[#2bff88]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {result && (
          <div
            key={`${result.name}-${result.score}-${result.rank}`}
            className="fx-rise border-l-4 border-[#2bff88] bg-[#2bff88]/10 p-6"
            role="status"
          >
            <div className="font-[family-name:var(--font-display)] text-xl font-semibold">
              {result.name} scored {fmt(result.score)} in {GAMES[result.game].name}
            </div>
            <p className="mt-2 text-[#8fa6a1]">
              You are now #{result.rank} on the overall ranking.
            </p>
            <a href="#ranking" className="mt-3 inline-block font-semibold text-[#2bff88] hover:underline">
              View ranking
            </a>
          </div>
        )}
      </div>

      <div>
        {game === "aim" ? (
          <AimTrainer key="aim" onFinish={onFinish} />
        ) : (
          <MemoryMatch key="memory" onFinish={onFinish} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STACKED TEXT BANNER                                               */
/* ------------------------------------------------------------------ */

const STACK_WORD = "DRAGON";
const STACK_SOLID = "JOIN THE ARMY";
const STACK_ROWS: ("ghost" | "outline" | "solid")[] = [
  "ghost",
  "outline",
  "outline",
  "solid",
  "outline",
  "outline",
  "ghost",
];

function Strip({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="overflow-hidden bg-[#2bff88] py-2.5 text-[#04110a]" aria-hidden="true">
      <div
        className={`${reverse ? "neon-marquee-rev" : "neon-marquee"} flex w-max items-center font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-widest`}
      >
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="px-4">Join the Dragon Army</span>
                <span className="h-2.5 w-2.5 rotate-45 bg-[#04110a]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedBanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--p", String(r.top + r.height / 2 - window.innerHeight / 2));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="stack" className="relative overflow-hidden bg-[#05080a]">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="stack-wave" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="1" seed="3" result="n">
            <animate
              attributeName="baseFrequency"
              dur="8s"
              values="0.006 0.05;0.012 0.07;0.006 0.05"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="38" />
        </filter>
      </svg>

      <Strip />

      <div className="relative py-14">
        <span className="absolute left-3 top-1/2 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.3em] text-[#8fa6a1] md:block">
          Hurry up · limited time offer
        </span>
        <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rotate-90 whitespace-nowrap font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.3em] text-[#2bff88] md:block">
          Season 2026 · Mega roster
        </span>

        {STACK_ROWS.map((kind, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const solid = kind === "solid";
          return (
            <Reveal key={i} delay={i * 70}>
              <div className="flex justify-center whitespace-nowrap">
                <div
                  className={`flex w-max gap-[0.45em] font-[family-name:var(--font-display)] font-bold uppercase leading-[0.88] text-[clamp(3rem,9vw,7.5rem)] ${
                    solid
                      ? "text-[#2bff88] [text-shadow:0_0_36px_rgba(43,255,136,0.55)]"
                      : kind === "ghost"
                      ? "txt-outline opacity-30"
                      : "txt-outline"
                  }`}
                  style={{
                    transform: `translateX(calc(var(--p, 0) * ${dir * 0.22}px))`,
                    filter: solid ? "url(#stack-wave)" : undefined,
                  }}
                >
                  {Array.from({ length: solid ? 3 : 5 }).map((_, j) => (
                    <span key={j}>{solid ? STACK_SOLID : STACK_WORD}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}

        <Reveal delay={200} className="relative z-10 mt-10 flex flex-col items-center px-6 text-center">
          <p className="max-w-md text-[#8fa6a1]">
            We are running the <span className="text-[#2bff88]">most insane</span> season on the
            market. Be part of it.
          </p>
          <div className="mt-6">
            <Button href="#shop">Swipe up · Join now</Button>
          </div>
        </Reveal>
      </div>

      <Strip reverse />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Auth state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // scroll state
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState("home");

  // cart
  const [cart, setCart] = useState(3);
  const [bump, setBump] = useState(0);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // ranking + mini game state (ข้อมูลมาจาก MongoDB ผ่าน /api/scores)
  const [players, setPlayers] = useState<Player[]>([]);
  const [tab, setTab] = useState<Tab>("total");
  const [game, setGame] = useState<GameKey>("aim");
  const [nick, setNick] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const loadPlayers = async () => {
    try {
      const r = await fetch("/api/scores", { cache: "no-store" });
      if (r.ok) setPlayers((await r.json()).players);
    } catch {
      /* ignore network errors */
    }
  };

  // โหลด ranking + เช็คว่า login ค้างอยู่ไหม (cookie)
  useEffect(() => {
    loadPlayers();
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.username) {
          setCurrentUser(j.username);
          setNick(j.username);
        }
      })
      .catch(() => {});
  }, []);

  // ใช้ทั้ง login และ register: คืน error message หรือ null ถ้าสำเร็จ
  const handleAuth = async (
    mode: "login" | "register",
    data: { username: string; email: string; password: string }
  ): Promise<string | null> => {
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return json.error ?? "Something went wrong";
      setCurrentUser(json.username);
      setNick(json.username);
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setNick("");
    setResult(null);
  };

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMenu(false);
  };

  const submitScore = async (g: GameKey, score: number) => {
    if (!currentUser) {
      openAuth("login"); // ยังไม่ login ให้เด้งหน้า login
      return;
    }
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: g, score }),
      });
      if (res.status === 401) {
        setCurrentUser(null);
        openAuth("login");
        return;
      }
      if (!res.ok) return;
      const json = await res.json();
      setResult({ name: json.name, game: g, score, rank: json.rank });
      loadPlayers(); // รีเฟรช ranking
    } catch {
      /* ignore network errors */
    }
  };

  const addToCart = (name: string) => {
    setCart((c) => c + 1);
    setBump((b) => b + 1);
    setJustAdded(name);
    setTimeout(() => setJustAdded((n) => (n === name ? null : n)), 1200);
  };

  const goTo = (i: number) => {
    if (i === slide) return;
    setPrev(slide);
    setSlide(i);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setPrev(slide);
      setSlide((slide + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [slide]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 950);
    return () => clearTimeout(t);
  }, [prev, slide]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const el = rootRef.current;
      if (el) {
        el.style.setProperty("--sy", String(y));
        el.style.setProperty("--progress", String(max > 0 ? Math.min(1, y / max) : 0));
      }
      setScrolled(y > 24);
      setShowTop(y > 600);

      let cur = "home";
      for (const n of NAV) {
        const id = n.toLowerCase();
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const s = SLIDES[slide];
  const p = prev !== null ? SLIDES[prev] : null;

  return (
    <div
      ref={rootRef}
      className={`${display.variable} ${body.variable} min-h-screen bg-[#05080a] bg-[linear-gradient(rgba(43,255,136,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(43,255,136,0.045)_1px,transparent_1px)] bg-[size:56px_56px] font-[family-name:var(--font-body)] text-white antialiased`}
    >
      <style>{`
        html { scroll-behavior: smooth; }

        .txt-outline { color: transparent; -webkit-text-stroke: 2px rgba(43,255,136,.85); transition: color .3s ease, text-shadow .3s ease; }
        .txt-outline:hover { color: rgba(43,255,136,.9); text-shadow: 0 0 30px rgba(43,255,136,.6); }
        .neon-marquee-rev { animation: neon-marquee 30s linear infinite reverse; }
        @media (prefers-reduced-motion: reduce) { .neon-marquee-rev { animation: none; } }
        section[id] { scroll-margin-top: 60px; }

        @keyframes neon-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .neon-marquee { animation: neon-marquee 30s linear infinite; }

        .reveal { opacity: 0; transition: opacity .75s ease, transform .75s cubic-bezier(.2,.8,.2,1), clip-path .9s cubic-bezier(.7,0,.2,1); }
        .reveal-up { transform: translateY(44px); }
        .reveal-left { transform: translateX(-70px); }
        .reveal-right { transform: translateX(70px); }
        .reveal-zoom { transform: scale(.88); }
        .reveal-wipe { opacity: 1; clip-path: inset(-30px 100% -30px -30px); }
        .reveal.is-in { opacity: 1; transform: none; }
        .reveal-wipe.is-in { clip-path: inset(-30px -30px -30px -30px); }

        .bar-grow { width: 0; transition: width .8s cubic-bezier(.2,.8,.2,1) .25s; }
        .is-in .bar-grow { width: 4rem; }

        @keyframes heroIn {
          from { clip-path: inset(0 0 0 100%); transform: scale(1.18) translateX(50px); filter: brightness(2.2) saturate(1.5); }
          to   { clip-path: inset(0 0 0 0); transform: none; filter: none; }
        }
        @keyframes heroOut {
          from { opacity: 1; transform: none; filter: none; }
          to   { opacity: 0; transform: scale(.92) translateX(-40px); filter: brightness(.4) blur(3px); }
        }
        @keyframes heroSweep {
          from { left: 100%; opacity: 1; }
          to   { left: -8%; opacity: 0; }
        }
        @keyframes heroProgress { from { width: 0; } to { width: 100%; } }
        @keyframes titleIn {
          0%   { opacity: 0; transform: translateX(-60px) skewX(-10deg); filter: blur(10px); text-shadow: 6px 0 #ff2a55, -6px 0 #2bff88; }
          60%  { opacity: 1; filter: blur(0); text-shadow: 3px 0 #ff2a55, -3px 0 #2bff88; }
          100% { opacity: 1; transform: none; filter: none; }
        }
        .hero-in { animation: heroIn .9s cubic-bezier(.2,.8,.2,1) both; }
        .hero-out { animation: heroOut .9s ease both; }
        .hero-sweep { position: absolute; top: 0; bottom: 0; width: 6px; background: #fff; box-shadow: 0 0 34px 12px #2bff88; z-index: 5; pointer-events: none; animation: heroSweep .9s cubic-bezier(.6,0,.2,1) both; }
        .hero-progress { animation: heroProgress ${SLIDE_MS}ms linear both; }
        .fx-title { animation: titleIn .8s cubic-bezier(.2,.8,.2,1) both; }

        @keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .fx-rise { animation: rise .6s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes bump { 0% { transform: scale(1); } 40% { transform: scale(1.9); color: #2bff88; } 100% { transform: scale(1); } }
        .fx-bump { animation: bump .45s ease-out; }
        @keyframes shake { 0%,100% { transform: translate(0,0); } 20% { transform: translate(-6px,2px); } 40% { transform: translate(5px,-3px); } 60% { transform: translate(-4px,-2px); } 80% { transform: translate(3px,2px); } }
        .fx-shake { animation: shake .26s linear; box-shadow: inset 0 0 40px rgba(255,42,85,.45); }
        @keyframes pulseWarn { 50% { box-shadow: 0 0 20px rgba(255,42,85,.7); } }
        @keyframes pop { 0% { transform: scale(.7) rotateY(90deg); } 100% { transform: scale(1) rotateY(0); } }
        .fx-pop { animation: pop .3s ease-out; }
        @keyframes match { 0% { transform: scale(1); } 40% { transform: scale(1.14); box-shadow: 0 0 24px #2bff88; } 100% { transform: scale(1); } }
        .fx-match { animation: match .45s ease-out; }

        .fx-ring { position: absolute; left: 0; top: 0; width: 12px; height: 12px; margin: -6px 0 0 -6px; border: 2px solid #2bff88; border-radius: 9999px; box-shadow: 0 0 14px #2bff88; animation: fxRing .6s ease-out forwards; }
        @keyframes fxRing { to { transform: scale(6); opacity: 0; } }
        .fx-shard { position: absolute; left: 0; top: 0; width: 3px; height: 14px; margin: -7px 0 0 -1.5px; background: linear-gradient(#2bff88, #ff2a55); box-shadow: 0 0 8px #2bff88; transform: rotate(var(--a)) translateY(-6px); animation: fxShard .6s ease-out forwards; }
        @keyframes fxShard { to { transform: rotate(var(--a)) translateY(-48px) scaleY(.2); opacity: 0; } }
        .fx-float { white-space: nowrap; animation: fxFloat .7s ease-out forwards; text-shadow: 0 0 12px currentColor; }
        @keyframes fxFloat { from { opacity: 1; transform: translate(-50%,-50%); } to { opacity: 0; transform: translate(-50%,-170%) scale(1.3); } }

        .btn-shine { position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%); transform: translateX(-120%); transition: transform .6s ease; pointer-events: none; }
        .btn-fx:hover .btn-shine { transform: translateX(120%); }

        .nav-link { position: relative; padding: 6px 0; }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px; background: #2bff88; box-shadow: 0 0 10px #2bff88; transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
        .nav-link:hover::after, .nav-link.is-active::after { transform: scaleX(1); }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .neon-marquee { animation: none; }
          .reveal, .reveal-wipe { opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; }
          .bar-grow { width: 4rem; transition: none; }
          .hero-in, .hero-out, .hero-sweep, .fx-title, .fx-rise, .fx-pop, .fx-match, .fx-shake { animation: none !important; }
          .hero-progress { animation: none; width: 100%; }
        }
      `}</style>

      {/* ---------------- SCROLL PROGRESS ---------------- */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-[#2bff88] via-[#7dff4f] to-[#ff2a55] shadow-[0_0_12px_#2bff88]"
        style={{ transform: "scaleX(var(--progress, 0))" }}
        aria-hidden="true"
      />

      <ClickFx />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSubmitAuth={handleAuth}
      />

      {/* ---------------- HEADER ---------------- */}
      <div
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-[#2bff88]/30 bg-[#05080a]/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <header
          className={`relative mx-auto flex max-w-[1320px] items-center justify-between px-6 transition-[height] duration-300 ${
            scrolled ? "h-[60px]" : "h-[74px]"
          }`}
        >
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {NAV.map((n) => {
              const id = n.toLowerCase();
              const on = active === id;
              return (
                <a
                  key={n}
                  href={`#${id}`}
                  className={`nav-link font-[family-name:var(--font-display)] text-xs font-medium uppercase tracking-wider transition-colors hover:text-[#2bff88] ${
                    on ? "is-active text-[#2bff88]" : "text-white"
                  }`}
                >
                  {n}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-8 lg:flex">
            <a
              href="#shop"
              className="font-[family-name:var(--font-display)] text-xs font-medium uppercase tracking-wider hover:text-[#2bff88]"
            >
              Cart(
              <span key={bump} className={`inline-block ${bump ? "fx-bump" : ""}`}>
                {cart}
              </span>
              )
            </a>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#2bff88]">
                  {currentUser}
                </span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => openAuth("login")}>Login</Button>
            )}
          </div>

          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            <span className={`h-0.5 w-6 bg-white transition-transform ${menu ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-opacity ${menu ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition-transform ${menu ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>

          {menu && (
            <div className="fx-rise absolute left-0 right-0 top-full border-t border-white/10 bg-[#0a1014] px-6 py-6 lg:hidden">
              <div className="flex flex-col gap-4">
                {NAV.map((n) => (
                  <a
                    key={n}
                    href={`#${n.toLowerCase()}`}
                    onClick={() => setMenu(false)}
                    className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wider"
                  >
                    {n}
                  </a>
                ))}
                {currentUser ? (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <span className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#2bff88]">
                      Signed in as: {currentUser}
                    </span>
                    <Button onClick={handleLogout} variant="outline">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => openAuth("login")}>Login</Button>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section
        id="home"
        className="relative min-h-[620px] bg-[radial-gradient(circle_at_0%_100%,rgba(43,255,136,0.16),transparent_45%)] lg:min-h-[640px]"
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc(57%+10px)] [filter:drop-shadow(0_0_14px_rgba(255,42,85,0.9))] lg:block">
          <div className="h-full w-full bg-[#ff2a55] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]" />
        </div>

        <div className="absolute inset-y-0 right-0 w-full lg:w-[57%] lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]">
          <div
            className="absolute -inset-y-12 inset-x-0 opacity-40 will-change-transform lg:opacity-100"
            style={{ transform: "translateY(min(calc(var(--sy, 0) * 0.08px), 44px))" }}
          >
            {p && (
              <div key={`out-${prev}`} className="hero-out absolute inset-0">
                <HeroVisual image={p.image} index={prev as number} />
              </div>
            )}
            <div key={`in-${slide}`} className={`absolute inset-0 ${prev !== null ? "hero-in" : ""}`}>
              <HeroVisual image={s.image} index={slide} />
            </div>
          </div>
          {prev !== null && <div key={`sweep-${slide}`} className="hero-sweep" />}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1320px] items-center px-6 lg:min-h-[640px]">
          <div
            className="max-w-[560px] py-16"
            style={{
              transform: "translateY(calc(var(--sy, 0) * -0.06px))",
              opacity: "calc(1 - var(--sy, 0) / 900)",
            }}
          >
            <div key={slide}>
              <h1 className="fx-title font-[family-name:var(--font-display)] text-5xl font-bold uppercase leading-[1.1] [text-shadow:0_0_32px_rgba(43,255,136,0.4)] sm:text-6xl">
                {s.title}
              </h1>
              <p
                className="fx-rise mt-6 max-w-[340px] text-lg leading-snug text-white/90"
                style={{ animationDelay: "150ms" }}
              >
                {s.text}
              </p>
              <div className="fx-rise mt-10" style={{ animationDelay: "300ms" }}>
                <Button href={s.href}>{s.cta}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 transition-all duration-300 hover:bg-[#2bff88] ${
                i === slide ? "w-8 bg-[#2bff88] shadow-[0_0_10px_#2bff88]" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 z-20 h-[3px] w-full bg-white/10" aria-hidden="true">
          <div key={slide} className="hero-progress h-full bg-[#2bff88] shadow-[0_0_10px_#2bff88]" />
        </div>
      </section>

      {/* ---------------- TICKER ---------------- */}
      <div className="overflow-hidden border-y border-[#2bff88] bg-[#2bff88] py-3 text-[#04110a]" aria-hidden="true">
        <div className="neon-marquee flex w-max items-center font-[family-name:var(--font-display)] text-lg font-bold uppercase italic tracking-wider">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[
                "Dragon Esports",
                "Pacific Cup champions",
                "Live every weekend",
                "Play. Score. Rank up.",
                "Join the army",
              ].map((t) => (
                <span key={t} className="flex items-center">
                  <span className="px-6">{t}</span>
                  <span className="h-2.5 w-2.5 rotate-45 bg-[#04110a]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- STATS ---------------- */}
      <section className="border-y border-[#2bff88]/30 bg-[#0a1014]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-8 px-6 py-12 lg:grid-cols-4">
          {STATS.map((st, i) => (
            <Reveal key={st.label} variant="zoom" delay={i * 110}>
              <div className="text-center">
                <div className="font-[family-name:var(--font-display)] text-5xl font-bold text-[#2bff88] [text-shadow:0_0_22px_rgba(43,255,136,0.55)]">
                  <CountUp to={st.to} decimals={st.decimals} suffix={st.suffix} />
                </div>
                <div className="mt-2 text-[#8fa6a1]">{st.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="mx-auto max-w-[1320px] px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal variant="wipe">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#2bff88] shadow-[12px_12px_0_0_#ff2a55]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#b9ffd8,#2bff88_40%,#03301a)]" />
              <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-[10rem] font-bold text-[#0a1014]/40">
                DE
              </div>
              <div className="absolute bottom-0 left-0 bg-[#05080a] px-8 py-6">
                <div className="font-[family-name:var(--font-display)] text-4xl font-bold">
                  Since 2018
                </div>
                <div className="text-[#8fa6a1]">Competing worldwide</div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight sm:text-4xl">
              We play to win, together
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#8fa6a1]">
              Dragon Esports is a professional organisation with squads in nine
              titles. We build teams around discipline, communication and a
              love for the game, and we bring our fans along for every match.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Daily training with professional coaches",
                "Players supported by analysts and sports psychologists",
                "Open academy for upcoming talent",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 bg-[#2bff88]" />
                  <span className="text-lg">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="#team">Meet the team</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- TEAM ---------------- */}
      <section id="team" className="bg-[#0a1014] py-24">
        <div className="mx-auto max-w-[1320px] px-6">
          <SectionHead
            title="Our players"
            intro="The roster competing across our main titles this season."
            action={<Button variant="outline">View all players</Button>}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLAYERS.map((pl, i) => (
              <Reveal key={pl.name} delay={(i % 3) * 110} className="h-full">
                <article className="group h-full border border-white/10 bg-[#05080a] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#2bff88] hover:shadow-[0_0_28px_rgba(43,255,136,0.25)]">
                  <div
                    className="relative flex h-64 items-end overflow-hidden"
                    style={{
                      background: `linear-gradient(160deg, ${pl.color}, #05080a 90%)`,
                    }}
                  >
                    <span className="absolute -right-4 top-0 font-[family-name:var(--font-display)] text-[10rem] font-bold leading-none text-black/25 transition-transform duration-500 group-hover:-translate-x-3 group-hover:scale-110">
                      {pl.name.charAt(0)}
                    </span>
                    <span className="relative m-4 bg-[#05080a] px-3 py-1 text-sm font-medium">
                      {pl.game}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                      {pl.name}
                    </h3>
                    <p className="mt-1 text-[#8fa6a1]">{pl.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MATCHES ---------------- */}
      <section id="matches" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead
          title="Upcoming matches"
          intro="Catch every game live on our stream."
          action={<Button variant="outline">Full schedule</Button>}
        />
        <div className="divide-y divide-white/10 border-y border-white/10">
          {MATCHES.map((m, i) => (
            <Reveal key={m.date + m.vs} variant="left" delay={i * 90}>
              <div className="grid items-center gap-4 py-6 transition-all duration-200 hover:bg-white/[0.03] hover:pl-2 md:grid-cols-[120px_1fr_1fr_auto] md:px-4">
                <div>
                  <div className="font-[family-name:var(--font-display)] text-2xl font-bold">
                    {m.date}
                  </div>
                  <div className="text-[#8fa6a1]">{m.time}</div>
                </div>
                <div className="font-[family-name:var(--font-display)] text-xl font-semibold">
                  Dragon <span className="text-[#ff2a55]">vs</span> {m.vs}
                </div>
                <div className="text-[#8fa6a1]">
                  {m.game} · {m.event}
                </div>
                <Button variant="outline">Watch live</Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- RANKING ---------------- */}
      <section id="ranking" className="bg-[#0a1014] py-24">
        <div className="mx-auto max-w-[1320px] px-6">
          <SectionHead
            title="Player ranking"
            intro={`${players.length} players are competing for the top spot. Earn points in the mini games to climb the board.`}
            action={<Button href="#play">Play to rank up</Button>}
          />
          <Reveal>
            <Leaderboard
              players={players}
              tab={tab}
              onTab={setTab}
              meName={currentUser ?? ""}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- MINI GAMES ---------------- */}
      <section id="play" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead
          title="Mini games"
          intro="Log in, pick a game and play. Your score is added to the ranking right away."
        />
        <Reveal>
          <PlayZone
            nick={nick}
            loggedIn={!!currentUser}
            game={game}
            onGame={setGame}
            result={result}
            onFinish={(score) => submitScore(game, score)}
          />
        </Reveal>
      </section>

      {/* ---------------- ACHIEVEMENTS ---------------- */}
      <section id="achievements" className="bg-[#0a1014] py-24">
        <div className="mx-auto max-w-[1320px] px-6">
          <SectionHead
            title="Achievements"
            intro="Trophies from the events that shaped the team."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={i * 100} className="h-full">
                <div className="h-full border-l-4 border-[#2bff88] bg-[#05080a] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_28px_rgba(43,255,136,0.25)]">
                  <div className="text-[#8fa6a1]">{a.year}</div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
                    {a.title}
                  </h3>
                  <div className="mt-6 flex items-end justify-between">
                    <span className="font-medium">{a.place}</span>
                    <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2bff88]">
                      {a.prize}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STACKED TEXT BANNER ---------------- */}
      <StackedBanner />

      {/* ---------------- PARTNERS ---------------- */}
      <section id="partners" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead title="Our partners" />
        <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((pt, i) => (
            <Reveal key={pt} variant="zoom" delay={i * 70}>
              <div className="flex h-28 items-center justify-center bg-[#05080a] font-[family-name:var(--font-display)] text-xl font-bold tracking-widest text-white/50 transition-all duration-300 hover:text-[#2bff88] hover:[text-shadow:0_0_18px_#2bff88]">
                {pt}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- SHOP ---------------- */}
      <section id="shop" className="bg-[#0a1014] py-24">
        <div className="mx-auto max-w-[1320px] px-6">
          <SectionHead
            title="Team merch"
            intro="Official gear worn by the players."
            action={<Button variant="outline">Open the shop</Button>}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((pr, i) => (
              <Reveal key={pr.name} delay={i * 100}>
                <article className="group">
                  <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#101a1f] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(43,255,136,0.25)]">
                    {pr.tag && (
                      <span className="absolute left-4 top-4 bg-[#2bff88] px-3 py-1 text-xs font-bold uppercase text-[#04110a]">
                        {pr.tag}
                      </span>
                    )}
                    <svg
                      viewBox="0 0 120 120"
                      className="h-40 w-40 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      {i === 2 ? (
                        <path d="M20 80c0-30 20-50 40-50s40 20 40 50H20zm-6 0h100v10H14z" fill="#2bff88" />
                      ) : i === 3 ? (
                        <rect x="10" y="30" width="100" height="60" rx="8" fill="#2bff88" />
                      ) : (
                        <path d="M40 15 15 35l12 18 10-6v58h46V47l10 6 12-18-25-20c-4 8-12 12-20 12s-16-4-20-12z" fill="#2bff88" />
                      )}
                    </svg>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                      {pr.name}
                    </h3>
                    <span className="font-semibold text-[#2bff88]">{pr.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(pr.name)}
                    className={`mt-4 w-full border py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
                      justAdded === pr.name
                        ? "border-[#2bff88] bg-[#2bff88] text-[#04110a] shadow-[0_0_20px_rgba(43,255,136,0.5)]"
                        : "border-white/20 hover:border-[#2bff88] hover:bg-[#2bff88] hover:text-[#04110a]"
                    }`}
                  >
                    {justAdded === pr.name ? "Added ✓" : "Add to cart"}
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEWS ---------------- */}
      <section id="pages" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead
          title="Latest news"
          action={<Button variant="outline">All news</Button>}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={i * 120}>
              <article className="group cursor-pointer">
                <div className="overflow-hidden">
                  <div
                    className="h-52 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(${130 + i * 30}deg, #2bff88, #05080a)`,
                    }}
                  />
                </div>
                <div className="mt-5 flex gap-4 text-sm text-[#8fa6a1]">
                  <span className="text-[#2bff88]">{n.cat}</span>
                  <span>{n.date}</span>
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug transition-colors group-hover:text-[#2bff88]">
                  {n.title}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="bg-[#2bff88] bg-[repeating-linear-gradient(135deg,transparent_0_18px,rgba(0,0,0,0.08)_18px_36px)] text-[#04110a]">
        <div className="mx-auto max-w-[1320px] px-6 py-16">
          <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase sm:text-4xl">
                Never miss a match
              </h2>
              <p className="mt-2 text-lg text-[#04110a]/80">
                Get schedules and news in your inbox every week.
              </p>
            </div>
            {subscribed ? (
              <p className="fx-rise font-[family-name:var(--font-display)] text-xl font-semibold">
                You&apos;re subscribed. See you at the next match.
              </p>
            ) : (
              <form
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  aria-label="Email address"
                  className="h-12 flex-1 bg-[#05080a] px-4 text-white placeholder:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                />
                <button
                  type="submit"
                  className="h-12 bg-[#05080a] px-6 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wider text-[#2bff88] transition-all hover:bg-black active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-white/10 bg-[#05080a]">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <Logo />
            <p className="mt-5 max-w-xs text-[#8fa6a1]">
              Professional esports organisation competing in nine titles
              worldwide.
            </p>
          </Reveal>
          {[
            { h: "Team", l: ["About", "Players", "Coaches", "Careers"] },
            { h: "Fans", l: ["Matches", "News", "Shop", "Fan club"] },
            { h: "Support", l: ["Contact", "FAQ", "Shipping", "Privacy"] },
          ].map((c, i) => (
            <Reveal key={c.h} delay={(i + 1) * 100}>
              <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider">
                {c.h}
              </h4>
              <ul className="mt-5 space-y-3">
                {c.l.map((x) => (
                  <li key={x}>
                    <a
                      href="#"
                      className="inline-block text-[#8fa6a1] transition-all hover:translate-x-1 hover:text-[#2bff88]"
                    >
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="border-t border-white/10 py-6 text-center text-sm text-[#8fa6a1]">
          © 2026 Dragon Esports. All rights reserved.
        </div>
      </footer>

      {/* ---------------- BACK TO TOP ---------------- */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center bg-[#2bff88] text-[#04110a] shadow-[0_0_22px_rgba(43,255,136,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#6bffaa] active:scale-90 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 19V5m-6 6 6-6 6 6" />
        </svg>
      </button>
    </div>
  );
}