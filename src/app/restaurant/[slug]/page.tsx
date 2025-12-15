"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRestaurantBySlug, getMenuItems } from "@/lib/firestore";
import { motion } from "framer-motion";
import Model3DViewer from "@/components/Model3DViewer";

export default function CustomerMenu() {
  const { slug }: any = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const r = await getRestaurantBySlug(slug);
      setRestaurant(r);
      setItems(await getMenuItems(r.id));
    })();
  }, [slug]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{restaurant?.name}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((i, idx) => (
          <motion.div key={i.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <div className="border rounded overflow-hidden">
              {i.model3dUrl ? (
                <Model3DViewer modelUrl={i.model3dUrl} dishName={""} />
              ) : (
                <img src={i.imageUrl} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold">{i.name}</h3>
                <p>${i.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
