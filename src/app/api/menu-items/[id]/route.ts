import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";

export const runtime = "nodejs";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    const db = await getDb();
    const [rows] = await db.query<any[]>(
      "SELECT * FROM menu_items WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("menu-items [id] GET error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const db = await getDb();

    const [rows] = await db.query<any[]>(
      "SELECT * FROM menu_items WHERE id = ? LIMIT 1",
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    const item = rows[0];
    const updated = {
      name: body.name ?? item.name,
      price: body.price !== undefined ? Number(body.price) : item.price,
      category: body.category ?? item.category,
      description: body.description ?? item.description,
      imageUrl: body.imageUrl ?? item.imageUrl,
      model3dUrl: body.model3dUrl ?? item.model3dUrl,
      isFeatured:
        body.isFeatured !== undefined
          ? Boolean(body.isFeatured)
          : item.isFeatured,
    };

    await db.query(
      `UPDATE menu_items SET 
      name = ?, price = ?, category = ?, description = ?, imageUrl = ?, model3dUrl = ?, isFeatured = ?
      WHERE id = ?`,
      [
        updated.name,
        updated.price,
        updated.category,
        updated.description,
        updated.imageUrl,
        updated.model3dUrl,
        updated.isFeatured,
        id,
      ]
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("menu-items [id] PUT error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    const db = await getDb();

    await db.query("DELETE FROM menu_items WHERE id = ?", [id]);

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (err) {
    console.error("menu-items [id] DELETE error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
