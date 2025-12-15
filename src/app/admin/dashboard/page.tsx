"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRestaurants } from "@/lib/firestore";
import RestaurantModal from "@/components/RestaurantModal";
import { useFirebaseAuth } from "@/lib/useFirebaseAuth";

export default function Dashboard() {
  const { logout } = useFirebaseAuth();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllRestaurants().then(setRestaurants);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowModal(true)}>+ Add Restaurant</Button>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {restaurants.map((r) => (
              <div key={r.id} className="border p-4 rounded">
                <h3 className="font-semibold">{r.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Link href={`/admin/menu/${r.slug}`}>
                    <Button size="sm">Manage Menu</Button>
                  </Link>
                  <Link href={`/qr`}>
                    <Button size="sm" variant="outline">QR</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <RestaurantModal
          mode="create"
          onClose={() => setShowModal(false)}
          onSave={(r) => setRestaurants([r, ...restaurants])}
        />
      )}
    </div>
  );
}
