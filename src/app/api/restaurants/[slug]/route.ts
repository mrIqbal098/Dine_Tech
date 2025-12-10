import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log("➡️ API HIT: /api/restaurants/", params.slug);

    const db = await getDb();

    // 1️⃣ Fetch restaurant first
    const [restaurants] = await db.query<any[]>(
      "SELECT id, name, slug, description, logoUrl, createdAt FROM restaurants WHERE slug = ? LIMIT 1",
      [params.slug]
    );

    console.log("➡️ RESTAURANT RESULT:", restaurants);

    if (!restaurants || restaurants.length === 0) {
      console.log("❌ Restaurant not found");
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const restaurant = restaurants[0];

    // 2️⃣ Fetch menu items
    const [menuItems] = await db.query<any[]>(
      "SELECT id, name, description, price, category, imageUrl, model3dUrl, isFeatured FROM menu_items WHERE restaurantId = ? ORDER BY category, name",
      [restaurant.id]
    );

    console.log("➡️ MENU ITEMS RESULT:", menuItems);

    // 3️⃣ Attach menu items safely
    restaurant.menuItems = Array.isArray(menuItems) ? menuItems : [];

    return NextResponse.json(restaurant, { status: 200 });
  } catch (error) {
    console.error("🔥 SERVER ERROR in /restaurants/[slug]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", detail: String(error) },
      { status: 500 }
    );
  }
}
