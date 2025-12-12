// src/app/admin/menu/[restaurant]/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FirebaseUpload from "@/components/FirebaseUpload";
import { getRestaurantBySlug, getMenuItemById, updateMenuItem } from "@/lib/firestore";
import { toast } from "sonner";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Beverages"];

export default function EditMenuItem() {
  const params = useParams();
  const router = useRouter();
  const slug: any = params.restaurant;
  const id = params.id as string;

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ name: "", description: "", price: "", category: CATEGORIES[0], imageUrl: "", model3dUrl: "", isFeatured: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug || !id) return router.push("/admin/dashboard");
      const r = await getRestaurantBySlug(slug);
      if (!r) return router.push("/admin/dashboard");
      setRestaurantId(r.id);
      const item = await getMenuItemById(r.id, id);
      if (!item) return router.push(`/admin/menu/${slug}`);
      setForm({ name: item.name ?? "", description: item.description ?? "", price: item.price?.toString() ?? "0", category: item.category ?? CATEGORIES[0], imageUrl: item.imageUrl ?? "", model3dUrl: item.model3dUrl ?? "", isFeatured: !!item.isFeatured });
      setLoading(false);
    })();
  }, [slug, id, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!restaurantId) return;
    setSaving(true);
    try {
      await updateMenuItem(restaurantId, id, { ...form, price: parseFloat(form.price || "0") });
      toast.success("Saved");
      router.push(`/admin/menu/${slug}`);
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Dish Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded p-2">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Image</Label>
            <FirebaseUpload
              value={form.imageUrl}
              onChange={(u) => setForm({ ...form, imageUrl: u })}
              folder={`restaurants/${restaurantId}/menu`}   // ✅ FIXED
            />
          </div>

          <div>
            <Label>3D Model (.glb)</Label>
            <FirebaseUpload
              value={form.model3dUrl}
              onChange={(u) => setForm({ ...form, model3dUrl: u })}
              accept=".glb,.gltf"
              folder={`restaurants/${restaurantId}/models`}  // ✅ FIXED
              label="Upload 3D Model"
            />
          </div>


          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/admin/menu/${slug}`)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
