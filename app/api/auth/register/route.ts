import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!/^[A-Za-z0-9_]{3,16}$/.test(username))
      return NextResponse.json({ error: "Username must be 3-16 characters (letters, numbers, _)" }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const db = await getDb();
    const users = db.collection("users");
    const players = db.collection("players");

    try {
      await users.createIndex({ usernameLower: 1 }, { unique: true });
      await users.createIndex({ email: 1 }, { unique: true });
    } catch (e) {
      console.error("createIndex failed:", e);
    }

    const usernameLower = username.toLowerCase();
    if (await players.findOne({ usernameLower }))
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });

    if (await users.findOne({ $or: [{ usernameLower }, { email }] }))
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });

    await users.insertOne({
      username,
      usernameLower,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date(),
    });

    await setSession(username);
    return NextResponse.json({ username });
  } catch (e: any) {
    console.error("REGISTER ERROR:", e?.code, e?.codeName, e?.errmsg ?? e);
    if (e?.code === 11000)
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
    return NextResponse.json({ error: "Server error. Check the terminal." }, { status: 500 });
  }
}