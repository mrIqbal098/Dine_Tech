import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [rows] = await db.query<any[]>(
      "SELECT * FROM menu_items WHERE restaurantId = ? ORDER BY createdAt DESC",
      [Number(restaurantId)]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("menu-items GET error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      restaurantId,
      name,
      price,
      category,
      description,
      imageUrl,
      model3dUrl,
      isFeatured,
    } = await req.json();

    if (!restaurantId || !name || price === undefined || !category) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.query(
      `INSERT INTO menu_items 
      (restaurantId, name, price, category, description, imageUrl, model3dUrl, isFeatured, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        Number(restaurantId),
        name,
        Number(price),
        category,
        description ?? null,
        imageUrl ?? null,
        model3dUrl ?? null,
        Boolean(isFeatured),
      ]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("menu-items POST error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
