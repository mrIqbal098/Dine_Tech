import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("token");
    if (!cookie) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 401 }
      );
    }

    const payload: any = jwt.verify(
      cookie.value,
      process.env.JWT_SECRET || "secret"
    );

    const db = await getDb();
    const [rows] = await db.query<any[]>(
      "SELECT id, name, email FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("me error", err);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
