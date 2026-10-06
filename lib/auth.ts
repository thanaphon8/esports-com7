import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "dragon_session";

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (!raw) throw new Error("Missing JWT_SECRET in .env.local");
  return new TextEncoder().encode(raw);
}

export async function setSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function getSession(): Promise<{ username: string } | null> {
  try {
    const c = await cookies();
    const token = c.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.username === "string" ? { username: payload.username } : null;
  } catch {
    return null;
  }
}