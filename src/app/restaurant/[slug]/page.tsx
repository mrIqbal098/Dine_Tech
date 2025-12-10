"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import Model3DViewer from "@/components/Model3DViewer";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  model3dUrl: string | null;
  isFeatured: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  menuItems: MenuItem[];
}

export default function RestaurantMenu() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    import("@/lib/api").then(({ apiFetch }) =>
      apiFetch(`/api/restaurants/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setRestaurant(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching restaurant:", error);
          setLoading(false);
        })
    );
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categories = ["all", ...Array.from(new Set(restaurant.menuItems.map((item) => item.category)))];
  const filteredItems = selectedCategory === "all"
    ? restaurant.menuItems
    : restaurant.menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="relative h-72 bg-gradient-to-br from-orange-500 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
              Back to Restaurants
            </Button>
          </Link>

          <div>
            <h1 className="text-5xl font-bold text-white mb-3">
              {restaurant.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      {item.model3dUrl ? (
                        <Model3DViewer modelUrl={item.model3dUrl} dishName={item.name} thumbnailUrl={item.imageUrl} />
                      ) : (
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {item.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500 text-white gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </h3>
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                        {item.description}
                      </p>

                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No items found in this category
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
