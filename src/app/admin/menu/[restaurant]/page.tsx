"use client";

import { useEffect, useState } from "react";
import { useRouter, } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2, Plus, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

export default function AdminMenu({ params }: { params: { restaurant: string } }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const restaurantSlug = params.restaurant;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!restaurantSlug) {
      router.push("/admin/dashboard");
      return;
    }

    setLoading(true);

    import("@/lib/api")
      .then(({ apiFetch }) =>
        apiFetch(`/api/restaurants/${restaurantSlug}`)
          .then((res) => res.json())
          .then((restaurant) => {
            setRestaurantId(restaurant.id);
            return apiFetch(`/api/menu-items?restaurantId=${restaurant.id}`);
          })
          .then((res) => res.json())
          .then((items) => {
            if (Array.isArray(items)) {
              setMenuItems(items);
            } else {
              console.error("Menu items API returned non-array:", items);
              setMenuItems([]); // prevents crash
            }
          })
          .catch((error) => {
            console.error("Error fetching menu items:", error);
            toast.error("Failed to load menu items");
          })
          .finally(() => setLoading(false))
      );
  }, [restaurantSlug, router]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const { apiFetch } = await import("@/lib/api");
      const response = await apiFetch(`/api/menu-items/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMenuItems(menuItems.filter((item) => item.id !== deleteId));
        toast.success("Menu item deleted successfully");
      } else {
        toast.error("Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
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

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Menu Management
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {menuItems.length} items
                </p>
              </div>
            </div>
            <Link href={`/admin/menu/${restaurantSlug}/add`}>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {menuItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                No menu items yet. Start by adding your first dish!
              </p>
              <Link href={`/admin/menu/${restaurantSlug}/add`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 capitalize">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Card className="overflow-hidden group">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
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
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {item.name}
                              </h3>
                              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="flex gap-2">
                              <Link href={`/admin/menu/${restaurantSlug}/edit/${item.id}`}>
                                <Button variant="outline" className="w-full gap-2">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => setDeleteId(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
