import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb(); // <-- FIXED

    const [existing] = await db.query<any[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query<any>(
      "INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, NOW())",
      [name, email, hashed]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      { user: { id: userId, name, email } },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
