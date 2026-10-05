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
/*  ถ้าใส่ url รูปใน image ระบบจะทำเป็นโทนแดง (duotone) ให้อัตโนมัติ      */
/* ------------------------------------------------------------------ */

const NAV = ["Home", "About", "Team", "Ranking", "Play", "Shop", "Pages"];

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
  { value: "12", label: "Tournament wins" },
  { value: "48", label: "Pro players" },
  { value: "2.4M", label: "Followers" },
  { value: "9", label: "Games" },
];

const PLAYERS = [
  { name: "Kaito 'Viper' Tanaka", role: "Team captain", game: "Valorant", color: "#2bff88" },
  { name: "Arthit 'Nova' Suwan", role: "Entry fragger", game: "Valorant", color: "#ff2a55" },
  { name: "Lena 'Frost' Moreau", role: "Support", game: "League of Legends", color: "#19e6a0" },
  { name: "Min-jun 'Rift' Park", role: "Mid laner", game: "League of Legends", color: "#2bff88" },
  { name: "Dmitri 'Ghost' Volkov", role: "AWPer", game: "CS2", color: "#ff2a55" },
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
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3">
      <svg width="40" height="44" viewBox="0 0 40 44" aria-hidden="true">
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
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex -skew-x-12 items-center justify-center px-7 py-3.5 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  const styles =
    variant === "solid"
      ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_22px_rgba(43,255,136,0.45)] hover:bg-[#6bffaa] hover:shadow-[0_0_34px_rgba(43,255,136,0.7)]"
      : "border border-white/30 text-white hover:border-[#2bff88] hover:text-[#2bff88] hover:shadow-[0_0_18px_rgba(43,255,136,0.3)]";
  const inner = <span className="inline-block skew-x-12">{children}</span>;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${styles}`}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href ?? "#"} className={`${base} ${styles}`}>
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
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-xl">
        <span className="mb-5 block h-1.5 w-16 -skew-x-12 bg-[#2bff88] shadow-[0_0_14px_#2bff88]" />
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lg text-[#8fa6a1]">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

/** แผงรูปโทนแดงทางขวาของ hero */
function HeroVisual({ image, index }: { image: string; index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#ff2a55]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover mix-blend-multiply grayscale contrast-125"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#ff6b8a_0%,#ff2a55_35%,#3d0612_100%)]" />
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

/* ข้อมูลตัวอย่าง: ภายหลังเปลี่ยนเป็นดึงจาก API / database ได้ */
const INITIAL_PLAYERS: Player[] = [
  { name: "Viper", country: "JP", total: 15840, aim: 612, memory: 905, plays: 214 },
  { name: "Nova", country: "TH", total: 14260, aim: 648, memory: 820, plays: 198 },
  { name: "Frost", country: "FR", total: 12975, aim: 560, memory: 930, plays: 176 },
  { name: "Rift", country: "KR", total: 11430, aim: 590, memory: 780, plays: 160 },
  { name: "Ghost", country: "RU", total: 10120, aim: 634, memory: 690, plays: 151 },
  { name: "Blaze", country: "ES", total: 9385, aim: 520, memory: 860, plays: 139 },
  { name: "Mochi", country: "TH", total: 8210, aim: 470, memory: 810, plays: 128 },
  { name: "Zephyr", country: "DE", total: 7640, aim: 505, memory: 640, plays: 117 },
  { name: "Kitsune", country: "JP", total: 6925, aim: 430, memory: 760, plays: 104 },
  { name: "Pixel", country: "US", total: 5870, aim: 395, memory: 700, plays: 92 },
  { name: "Orbit", country: "BR", total: 4510, aim: 340, memory: 610, plays: 77 },
  { name: "Saber", country: "TH", total: 3280, aim: 310, memory: 520, plays: 59 },
];

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
  const colors = ["#2bff88", "#ff2a55", "#19e6a0", "#ff5c7c", "#7dff4f", "#ff4f6d"];
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
}: {
  p: Player;
  rank: number;
  value: number;
  unit: string;
  me: boolean;
}) {
  const first = rank === 1;
  const height = rank === 1 ? "md:h-[350px]" : rank === 2 ? "md:h-[300px]" : "md:h-[270px]";
  const order = rank === 1 ? "md:order-2" : rank === 2 ? "md:order-1" : "md:order-3";
  return (
    <div
      className={`relative flex flex-col items-center justify-center px-6 py-10 text-center ${height} ${order} ${
        first ? "bg-[#ff2a55] shadow-[0_0_60px_rgba(255,42,85,0.5)]" : "border border-[#2bff88]/25 bg-[#05080a]"
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
          <path d="M2 24 5 6l9 9 4-12 4 12 9-9 3 18z" fill="#fff" />
        </svg>
      )}
      <Avatar name={p.name} size={first ? 88 : 72} dark={first} />
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold">{p.name}</h3>
      <p className={first ? "text-white/80" : "text-[#8fa6a1]"}>{p.country}</p>
      <div className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold">
        {fmt(value)}
      </div>
      <div className={`text-sm ${first ? "text-white/80" : "text-[#8fa6a1]"}`}>{unit}</div>
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
      className={`grid grid-cols-[48px_1fr_auto] items-center gap-4 border-l-4 px-4 py-4 md:grid-cols-[64px_1fr_100px_100px_140px] ${
        isMe(p.name) ? "border-[#2bff88] bg-[#2bff88]/15" : "border-transparent hover:bg-white/[0.03]"
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
      {/* tabs */}
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Ranking type">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => onTab(t.key)}
            className={`px-5 py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider transition-colors ${
              tab === t.key
                ? "bg-[#2bff88] text-[#04110a] shadow-[0_0_18px_rgba(43,255,136,0.4)]"
                : "border border-white/20 text-white hover:border-[#2bff88]"
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
        <>
          {/* podium */}
          <div className="grid items-end gap-4 md:grid-cols-3">
            {ranked.slice(0, 3).map((p, i) => (
              <PodiumCard key={p.name} p={p} rank={i + 1} value={p[tab]} unit={unit} me={isMe(p.name)} />
            ))}
          </div>

          {/* rank 4+ */}
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
        </>
      )}
    </div>
  );
}

function HudStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 border border-white/10 bg-[#0a1014] px-4 py-3">
      <div className="text-sm text-[#8fa6a1]">{label}</div>
      <div className="font-[family-name:var(--font-display)] text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ---------------- Mini game 1: Aim Trainer ---------------- */
function AimTrainer({ onFinish }: { onFinish: (score: number) => void }) {
  const DURATION = 30;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const scoreRef = useRef(0);

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

  const moveTarget = () =>
    setPos({ x: 8 + Math.random() * 84, y: 12 + Math.random() * 76 });

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setCombo(0);
    setHits(0);
    setMisses(0);
    setTime(DURATION);
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
    moveTarget();
  };

  const miss = () => {
    if (phase !== "playing") return;
    scoreRef.current = Math.max(0, scoreRef.current - 5);
    setScore(scoreRef.current);
    setCombo(0);
    setMisses((m) => m + 1);
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex gap-3">
        <HudStat label="Time" value={`${Math.max(time, 0)}s`} />
        <HudStat label="Score" value={score} />
        <HudStat label="Combo" value={`x${combo}`} />
        <HudStat label="Hits" value={hits} />
      </div>
      <div
        onClick={miss}
        className="relative h-[380px] cursor-crosshair select-none overflow-hidden border border-white/10 bg-[#0a1014] bg-[radial-gradient(circle_at_center,#101a1f_0%,#0a1014_70%)]"
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
                <div className="font-[family-name:var(--font-display)] text-6xl font-bold text-[#2bff88] [text-shadow:0_0_24px_rgba(43,255,136,0.6)]">
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
                className={`flex items-center justify-center text-3xl transition-colors sm:text-4xl ${
                  c.done
                    ? "bg-[#2bff88]/25 ring-1 ring-[#2bff88]"
                    : c.open
                    ? "bg-[#ff2a55]"
                    : "bg-[#101a1f] hover:bg-[#17252c]"
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
                <div className="font-[family-name:var(--font-display)] text-6xl font-bold text-[#2bff88] [text-shadow:0_0_24px_rgba(43,255,136,0.6)]">
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
  onNick,
  game,
  onGame,
  result,
  onFinish,
}: {
  nick: string;
  onNick: (v: string) => void;
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
            maxLength={16}
            onChange={(e) => onNick(e.target.value)}
            placeholder="Guest"
            className="h-12 w-full border border-white/20 bg-[#0a1014] px-4 text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2bff88]"
          />
          <p className="mt-2 text-sm text-[#8fa6a1]">
            Scores are saved under this name. Use the same name to keep adding points.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(GAMES) as GameKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onGame(k)}
              aria-pressed={game === k}
              className={`p-4 text-left transition-colors ${
                game === k
                  ? "bg-[#2bff88] text-[#04110a]"
                  : "border border-white/15 bg-[#0a1014] hover:border-[#2bff88]"
              }`}
            >
              <div className="font-[family-name:var(--font-display)] text-lg font-semibold">
                {GAMES[k].name}
              </div>
            </button>
          ))}
        </div>

        <div className="border border-white/10 bg-[#0a1014] p-6">
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
          <div className="border-l-4 border-[#2bff88] bg-[#2bff88]/10 p-6" role="status">
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
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [menu, setMenu] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // ranking + mini game state (preview: เก็บในหน่วยความจำ รีเฟรชแล้วรีเซ็ต)
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [tab, setTab] = useState<Tab>("total");
  const [game, setGame] = useState<GameKey>("aim");
  const [nick, setNick] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submitScore = (g: GameKey, score: number) => {
    const name = (nick.trim() || "Guest").slice(0, 16);
    const same = (n: string) => n.toLowerCase() === name.toLowerCase();
    const exists = players.some((p) => same(p.name));
    const updated: Player[] = exists
      ? players.map((p) =>
          same(p.name)
            ? {
                ...p,
                total: p.total + score,
                plays: p.plays + 1,
                aim: g === "aim" ? Math.max(p.aim, score) : p.aim,
                memory: g === "memory" ? Math.max(p.memory, score) : p.memory,
              }
            : p
        )
      : [
          ...players,
          {
            name,
            country: "--",
            total: score,
            plays: 1,
            aim: g === "aim" ? score : 0,
            memory: g === "memory" ? score : 0,
          },
        ];
    const rank = [...updated].sort((a, b) => b.total - a.total).findIndex((p) => same(p.name)) + 1;
    setPlayers(updated);
    setResult({ name, game: g, score, rank });
  };

  const next = () => setSlide((s) => (s + 1) % SLIDES.length);
  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[slide];

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#05080a] bg-[linear-gradient(rgba(43,255,136,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(43,255,136,0.045)_1px,transparent_1px)] bg-[size:56px_56px] font-[family-name:var(--font-body)] text-white antialiased`}
    >
      <style>{`
        @keyframes neon-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .neon-marquee { animation: neon-marquee 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .neon-marquee { animation: none; } }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header className="relative z-30 mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              className="font-[family-name:var(--font-display)] text-xs font-medium uppercase tracking-wider text-white transition-colors hover:text-[#2bff88]"
            >
              {n}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-8 lg:flex">
          <a
            href="#shop"
            className="font-[family-name:var(--font-display)] text-xs font-medium uppercase tracking-wider hover:text-[#2bff88]"
          >
            Cart(3)
          </a>
          <Button href="#shop">Buy merch</Button>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
          aria-expanded={menu}
        >
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
        </button>

        {menu && (
          <div className="absolute left-0 right-0 top-[74px] border-t border-white/10 bg-[#0a1014] px-6 py-6 lg:hidden">
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
              <Button href="#shop">Buy merch</Button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section
        id="home"
        className="relative min-h-[620px] bg-[radial-gradient(circle_at_0%_100%,rgba(43,255,136,0.16),transparent_45%)] lg:min-h-[640px]"
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc(57%+10px)] [filter:drop-shadow(0_0_14px_rgba(43,255,136,0.9))] lg:block">
          <div className="h-full w-full bg-[#2bff88] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]" />
        </div>
        <div className="absolute inset-y-0 right-0 w-full lg:w-[57%] lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]">
          <div key={slide} className="absolute inset-0 opacity-40 lg:opacity-100">
            <HeroVisual image={s.image} index={slide} />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1320px] items-center px-6 lg:min-h-[640px]">
          <div className="max-w-[560px] py-16">
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold uppercase leading-[1.1] sm:text-6xl">
              {s.title}
            </h1>
            <p className="mt-6 max-w-[340px] text-lg leading-snug text-white/90">
              {s.text}
            </p>
            <div className="mt-10">
              <Button href={s.href}>{s.cta}</Button>
            </div>
          </div>
        </div>

        {/* arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0a1014] shadow-lg hover:bg-[#2bff88] hover:text-[#04110a] sm:left-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-[#0a1014] shadow-lg hover:bg-[#2bff88] hover:text-[#04110a]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>

        {/* dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 transition-all ${
                i === slide ? "w-8 bg-[#2bff88]" : "w-4 bg-white/30"
              }`}
            />
          ))}
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
      <section className="border-y border-white/10 bg-[#0a1014]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-8 px-6 py-12 lg:grid-cols-4">
          {STATS.map((st) => (
            <div key={st.label} className="text-center">
              <div className="font-[family-name:var(--font-display)] text-5xl font-bold text-[#2bff88] [text-shadow:0_0_22px_rgba(43,255,136,0.55)]">
                {st.value}
              </div>
              <div className="mt-2 text-[#8fa6a1]">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="mx-auto max-w-[1320px] px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#ff2a55] shadow-[12px_12px_0_0_#2bff88]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ff6b8a,#ff2a55_40%,#2e0610)]" />
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

          <div>
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
          </div>
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
            {PLAYERS.map((p) => (
              <article
                key={p.name}
                className="group border border-white/10 bg-[#05080a] transition-all hover:border-[#2bff88] hover:shadow-[0_0_28px_rgba(43,255,136,0.25)]"
              >
                <div
                  className="relative flex h-64 items-end overflow-hidden"
                  style={{
                    background: `linear-gradient(160deg, ${p.color}, #05080a 90%)`,
                  }}
                >
                  <span className="absolute -right-4 top-0 font-[family-name:var(--font-display)] text-[10rem] font-bold leading-none text-black/25">
                    {p.name.charAt(0)}
                  </span>
                  <span className="relative m-4 bg-[#05080a] px-3 py-1 text-sm font-medium">
                    {p.game}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[#8fa6a1]">{p.role}</p>
                </div>
              </article>
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
          {MATCHES.map((m) => (
            <div
              key={m.date + m.vs}
              className="grid items-center gap-4 py-6 transition-colors hover:bg-white/[0.03] md:grid-cols-[120px_1fr_1fr_auto] md:px-4"
            >
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
          <Leaderboard
            players={players}
            tab={tab}
            onTab={setTab}
            meName={result?.name ?? nick.trim()}
          />
        </div>
      </section>

      {/* ---------------- MINI GAMES ---------------- */}
      <section id="play" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead
          title="Mini games"
          intro="Pick a game, set your nickname and play. Your score is added to the ranking right away."
        />
        <PlayZone
          nick={nick}
          onNick={setNick}
          game={game}
          onGame={setGame}
          result={result}
          onFinish={(score) => submitScore(game, score)}
        />
      </section>

      {/* ---------------- ACHIEVEMENTS ---------------- */}
      <section id="achievements" className="bg-[#0a1014] py-24">
        <div className="mx-auto max-w-[1320px] px-6">
          <SectionHead
            title="Achievements"
            intro="Trophies from the events that shaped the team."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.title}
                className="border-l-4 border-[#ff2a55] bg-[#05080a] p-8"
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PARTNERS ---------------- */}
      <section id="partners" className="mx-auto max-w-[1320px] px-6 py-24">
        <SectionHead title="Our partners" />
        <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <div
              key={p}
              className="flex h-28 items-center justify-center bg-[#05080a] font-[family-name:var(--font-display)] text-xl font-bold tracking-widest text-white/50 transition-colors hover:text-[#2bff88]"
            >
              {p}
            </div>
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
            {PRODUCTS.map((p, i) => (
              <article key={p.name} className="group">
                <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#101a1f]">
                  {p.tag && (
                    <span className="absolute left-4 top-4 bg-[#ff2a55] px-3 py-1 text-xs font-semibold uppercase">
                      {p.tag}
                    </span>
                  )}
                  <svg
                    viewBox="0 0 120 120"
                    className="h-40 w-40 transition-transform group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {i === 2 ? (
                      <path d="M20 80c0-30 20-50 40-50s40 20 40 50H20zm-6 0h100v10H14z" fill="#2bff88" />
                    ) : i === 3 ? (
                      <rect x="10" y="30" width="100" height="60" rx="8" fill="#2bff88" />
                    ) : (
                      <path d="M40 15 15 35l12 18 10-6v58h46V47l10 6 12-18-25-20c-4 8-12 12-20 12s-16-4-20-12z" fill="#ff2a55" />
                    )}
                  </svg>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                    {p.name}
                  </h3>
                  <span className="font-semibold text-[#2bff88]">{p.price}</span>
                </div>
                <button className="mt-4 w-full border border-white/20 py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider transition-colors hover:border-[#2bff88] hover:bg-[#2bff88] hover:text-[#04110a]">
                  Add to cart
                </button>
              </article>
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
            <article key={n.title} className="group">
              <div
                className="h-52 transition-opacity group-hover:opacity-90"
                style={{
                  background: `linear-gradient(${130 + i * 30}deg, ${i === 1 ? "#2bff88" : "#ff2a55"}, #05080a)`,
                }}
              />
              <div className="mt-5 flex gap-4 text-sm text-[#8fa6a1]">
                <span className="text-[#2bff88]">{n.cat}</span>
                <span>{n.date}</span>
              </div>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug group-hover:text-[#2bff88]">
                {n.title}
              </h3>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="bg-[#ff2a55] bg-[repeating-linear-gradient(135deg,transparent_0_18px,rgba(0,0,0,0.1)_18px_36px)]">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase sm:text-4xl">
              Never miss a match
            </h2>
            <p className="mt-2 text-lg text-white/90">
              Get schedules and news in your inbox every week.
            </p>
          </div>
          {subscribed ? (
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold">
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
                className="h-12 flex-1 bg-white px-4 text-[#0a1014] placeholder:text-[#0a1014]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1014]"
              />
              <button
                type="submit"
                className="h-12 bg-[#0a1014] px-6 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider hover:bg-black"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-white/10 bg-[#05080a]">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[#8fa6a1]">
              Professional esports organisation competing in nine titles
              worldwide.
            </p>
          </div>
          {[
            { h: "Team", l: ["About", "Players", "Coaches", "Careers"] },
            { h: "Fans", l: ["Matches", "News", "Shop", "Fan club"] },
            { h: "Support", l: ["Contact", "FAQ", "Shipping", "Privacy"] },
          ].map((c) => (
            <div key={c.h}>
              <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wider">
                {c.h}
              </h4>
              <ul className="mt-5 space-y-3">
                {c.l.map((x) => (
                  <li key={x}>
                    <a href="#" className="text-[#8fa6a1] hover:text-[#2bff88]">
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-6 text-center text-sm text-[#8fa6a1]">
          © 2026 Dragon Esports. All rights reserved.
        </div>
      </footer>
    </div>
  );
}