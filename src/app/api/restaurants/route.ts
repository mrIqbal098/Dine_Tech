import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();  // <-- IMPORTANT

    const [rows] = await db.query(
      "SELECT id, name, slug, description, logoUrl, createdAt FROM restaurants ORDER BY createdAt DESC"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("restaurants GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
// (Optional) Admin create restaurant
export async function POST(req: NextRequest) {
  try {
    const { name, slug, description, logoUrl } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const db = await getDb();  // <-- FIXED

    await db.query(
      "INSERT INTO restaurants (name, slug, description, logoUrl, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [name, slug, description ?? null, logoUrl ?? null]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("restaurants POST error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

