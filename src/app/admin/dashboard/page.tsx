"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus, Loader2, Store, Menu as MenuIcon, QrCode } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
}

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    import("@/lib/api").then(({ apiFetch }) =>
      apiFetch("/api/restaurants")
        .then((res) => res.json())
        .then((data) => {
          console.log("DATA FROM API:", data); // ← ADD THIS
          setRestaurants(data);
          if (data.length > 0) {
            setSelectedRestaurant(data[0].slug);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
          setLoading(false);
        })
    );
  }, []);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut();
    localStorage.removeItem("bearer_token");
    router.push("/admin");
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Restaurant Admin Panel
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Welcome back, {session.user.name || session.user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Select Restaurant</CardTitle>
              <CardDescription>
                Choose a restaurant to manage its menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Store className="w-5 h-5 text-slate-500" />
                <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select a restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.slug}>
                        {restaurant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Link href={`/admin/menu/${selectedRestaurant}`}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MenuIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>Manage Menu</CardTitle>
                      <CardDescription>View and edit menu items</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href={`/admin/menu/${selectedRestaurant}/add`}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>Add Menu Item</CardTitle>
                      <CardDescription>Create a new dish</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/qr-codes">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>QR Codes</CardTitle>
                      <CardDescription>Generate menu QR codes</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href={`/restaurant/${selectedRestaurant}`}
                  target="_blank"
                  className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <p className="font-medium text-slate-900 dark:text-white">
                    View Customer Menu
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    See how customers view your menu
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}