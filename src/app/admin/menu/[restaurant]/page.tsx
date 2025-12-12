// src/app/admin/menu/[restaurant]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRestaurantBySlug, getMenuItems, deleteMenuItem } from "@/lib/firestore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminMenuPage() {
  const params = useParams();
  const router = useRouter();
  const slug: any = params.restaurant;
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!slug) return router.push("/admin/dashboard");
      setLoading(true);
      const r = await getRestaurantBySlug(slug);
      if (!r) return router.push("/admin/dashboard");
      setRestaurantId(r.id);
      const items = await getMenuItems(r.id);
      setMenuItems(items);
      setLoading(false);
    })();
  }, [slug, router]);

  const handleDelete = async (id: string) => {
    if (!restaurantId) return;
    if (!confirm("Delete this item?")) return;
    try {
      await deleteMenuItem(restaurantId, id);
      setMenuItems((p) => p.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <Link href={`/admin/menu/${slug}/add`}><Button>+ Add Item</Button></Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <Card key={item.id}>
              <div className="h-48 overflow-hidden">
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"} className="w-full h-full object-cover" />
              </div>
              <CardContent>
                <div className="flex justify-between">
                  <h3 className="font-bold">{item.name}</h3>
                  <div className="text-orange-600 font-bold">${(+item.price).toFixed(2)}</div>
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/admin/menu/${slug}/edit/${item.id}`}><Button variant="outline">Edit</Button></Link>
                  <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
