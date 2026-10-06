import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    await setSession(user.username);
    return NextResponse.json({ username: user.username });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return NextResponse.json({ error: "Server error. Check the terminal." }, { status: 500 });
  }
}