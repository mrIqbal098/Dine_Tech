"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Beverages"];

export default function EditMenuItem() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const restaurantSlug = params.restaurant;
  const menuItemId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Appetizers",
    imageUrl: "",
    model3dUrl: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!menuItemId || !restaurantSlug) {
      router.push("/admin/dashboard");
      return;
    }

    import("@/lib/api").then(({ apiFetch }) => {
      apiFetch(`/api/restaurants/${restaurantSlug}`)
        .then((res) => res.json())
        .then((data) => apiFetch(`/api/menu-items?restaurantId=${data.id}`))
        .then((res) => res.json())
        .then((items) => {
          const item = items.find((i: any) => i.id === parseInt(menuItemId));
          if (item) {
            setFormData({
              name: item.name,
              description: item.description || "",
              price: item.price.toString(),
              category: item.category,
              imageUrl: item.imageUrl || "",
              model3dUrl: item.model3dUrl || "",
              isFeatured: item.isFeatured,
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching menu item:", error);
          toast.error("Failed to load menu item");
          setLoading(false);
        });
    });
  }, [menuItemId, restaurantSlug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { apiFetch } = await import("@/lib/api");
      const response = await apiFetch(`/api/menu-items/${menuItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          imageUrl: formData.imageUrl || null,
          model3dUrl: formData.model3dUrl || null,
          isFeatured: formData.isFeatured,
        }),
      });

      if (response.ok) {
        toast.success("Menu item updated successfully");
        router.push(`/admin/menu?restaurant=${restaurantSlug}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update menu item");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/menu?restaurant=${restaurantSlug}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Edit Menu Item
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Update dish information
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dish Details</CardTitle>
            <CardDescription>
              Update the information about your dish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Dish Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Truffle Pasta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the dish, ingredients, and special features..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model3dUrl">3D Model URL (.glb)</Label>
                <Input
                  id="model3dUrl"
                  type="url"
                  placeholder="https://example.com/model.glb"
                  value={formData.model3dUrl}
                  onChange={(e) => setFormData({ ...formData, model3dUrl: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Item
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Highlight this dish on the menu
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/admin/menu?restaurant=${restaurantSlug}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
