"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRestaurantBySlug, getMenuItems } from "@/lib/firestore";
import { Loader2 } from "lucide-react";
import Model3DViewer from "@/components/Model3DViewer"; // keep your existing viewer

export default function RestaurantMenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await getRestaurantBySlug(slug);
      if (!r) return setLoading(false);
      setRestaurant(r);
      const items = await getMenuItems(r.id);
      setMenu(items);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!restaurant) return <div className="min-h-screen flex items-center justify-center">Restaurant not found</div>;

  const categories = ["all", ...Array.from(new Set(menu.map(m => m.category)))];
  const filtered = cat === "all" ? menu : menu.filter(m => m.category === cat);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-slate-600 mb-6">{restaurant.description}</p>

        <div className="mb-4 flex gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded ${cat===c ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>{c}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="border rounded overflow-hidden">
              {item.model3dUrl ? (
                <Model3DViewer modelUrl={item.model3dUrl} thumbnailUrl={item.imageUrl} dishName={item.name} />
              ) : (
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                <div className="mt-2 font-bold text-orange-600">${(+item.price).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
