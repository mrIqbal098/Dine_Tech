"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Sparkles, ArrowRight } from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ apiFetch }) =>
      apiFetch("/api/restaurants")
        .then((res) => res.json())
        .then((data) => {
          setRestaurants(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
          setLoading(false);
        })
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AR-Powered Menu Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Explore Menus in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600"> 3D Reality</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              View dishes in stunning 3D, explore ingredients, and make informed choices before you order.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/admin">
                <Button size="lg" variant="outline" className="gap-2">
                  <ChefHat className="w-5 h-5" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Featured Restaurants
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(restaurants) ? restaurants : []).map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={`/restaurant/${restaurant.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-orange-500">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={restaurant.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white">
                            {restaurant.name}
                          </h3>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                          {restaurant.description}
                        </p>
                        <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium group-hover:gap-2 transition-all">
                          View Menu
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}