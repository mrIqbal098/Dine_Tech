"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllRestaurants } from "@/lib/firestore";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const all = await getAllRestaurants();
        setRestaurants(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto p-8">

        <h2 className="text-3xl font-bold text-center mb-8">Featured Restaurants</h2>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 mb-4">No restaurants added yet.</p>

            <Link href="/admin/login">
              <Button className="gap-2">
                Go to Admin Login
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <Link key={r.id} href={`/restaurant/${r.slug}`}>
                <Card className="cursor-pointer overflow-hidden">
                  <div className="h-48">
                    <img
                      src={r.logoUrl || "https://via.placeholder.com/300"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent>
                    <h3 className="text-xl font-bold">{r.name}</h3>
                    <p className="text-sm text-slate-600">{r.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
