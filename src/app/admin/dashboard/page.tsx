"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import RestaurantModal from "@/components/RestaurantModal";
import { getAllRestaurants } from "@/lib/firestore";
import { useFirebaseAuth } from "@/lib/useFirebaseAuth";
import RequireAdmin from "@/components/RequireAdmin";

function DashboardPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { logout, user } = useFirebaseAuth();

  // Load Firestore Restaurants
  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await getAllRestaurants();
      setRestaurants(all);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Restaurant Admin Panel</h1>

          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Restaurants Card */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurants</CardTitle>
            <CardDescription>Manage your restaurants and menus</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Add Restaurant */}
            <Button onClick={() => setShowModal(true)}>+ Add Restaurant</Button>

            {/* Restaurant List */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : restaurants.length === 0 ? (
                <p>No restaurants yet.</p>
              ) : (
                restaurants.map((r) => (
                  <div key={r.id} className="p-4 border rounded space-y-2">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-slate-500">{r.slug}</p>

                    <div className="flex gap-2 mt-2">
                      <Link href={`/admin/menu/${r.slug}`}>
                        <Button variant="outline" size="sm">
                          Manage Menu
                        </Button>
                      </Link>

                      <Link href={`/restaurant/${r.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Modal */}
      {showModal && (
        <RestaurantModal
          mode="create"
          onClose={() => setShowModal(false)}
          onSave={(newRestaurant: any) => {
            setRestaurants([newRestaurant, ...restaurants]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default function ProtectedDashboard() {
  return (
    <RequireAdmin>
      <DashboardPage />
    </RequireAdmin>
  );
}
