import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const SEED = [
  { name: "Viper", country: "JP", total: 15840, aim: 612, memory: 905, plays: 214 },
  { name: "Nova", country: "TH", total: 14260, aim: 648, memory: 820, plays: 198 },
  { name: "Frost", country: "FR", total: 12975, aim: 560, memory: 930, plays: 176 },
  { name: "Rift", country: "KR", total: 11430, aim: 590, memory: 780, plays: 160 },
  { name: "Ghost", country: "RU", total: 10120, aim: 634, memory: 690, plays: 151 },
  { name: "Blaze", country: "ES", total: 9385, aim: 520, memory: 860, plays: 139 },
];

const MAX_SCORE = { aim: 1500, memory: 1000 }; // กันส่งคะแนนเกินจริง

// ดึง ranking
export async function GET() {
  const db = await getDb();
  const players = db.collection("players");

  if ((await players.countDocuments()) === 0) {
    await players.insertMany(
      SEED.map((p) => ({ ...p, usernameLower: p.name.toLowerCase(), seed: true }))
    );
  }

  const docs = await players
    .find({}, { projection: { _id: 0, name: 1, country: 1, total: 1, aim: 1, memory: 1, plays: 1 } })
    .sort({ total: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({ players: docs });
}

// ส่งคะแนน (ต้อง login)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const game = body.game as "aim" | "memory";
  const score = Number(body.score);

  if (game !== "aim" && game !== "memory")
    return NextResponse.json({ error: "Invalid game" }, { status: 400 });
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE[game])
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });

  const db = await getDb();
  const players = db.collection("players");
  const usernameLower = session.username.toLowerCase();
  const other = game === "aim" ? "memory" : "aim";

  const doc = await players.findOneAndUpdate(
    { usernameLower },
    {
      $inc: { total: Math.round(score), plays: 1 },
      $max: { [game]: Math.round(score) },
      $setOnInsert: { name: session.username, country: "--", [other]: 0 },
    },
    { upsert: true, returnDocument: "after" }
  );

  const rank = (await players.countDocuments({ total: { $gt: doc!.total } })) + 1;
  return NextResponse.json({ name: session.username, rank });
}