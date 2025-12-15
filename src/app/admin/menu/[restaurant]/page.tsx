"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRestaurantBySlug, getMenuItems } from "@/lib/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminMenu() {
    const params = useParams();
  const slug = params?.slug as string;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!slug) return; // ✅ wait until slug exists

    (async () => {
      const r = await getRestaurantBySlug(slug);
      if (!r) return; // optional safety

      const menu = await getMenuItems(r.id);
      setItems(menu);
      setLoading(false);
    })();
  }, [slug]);

    if (!slug || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Menu</h1>
        <Link href={`/admin/menu/${slug}/add`}>
          <Button>Add Item</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map(i => (
          <div key={i.id} className="border p-4 rounded">
            <img src={i.imageUrl} className="h-40 w-full object-cover rounded" />
            <h3 className="font-semibold mt-2">{i.name}</h3>
            <p>${i.price}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
