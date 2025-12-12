"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FirebaseUpload from "@/components/FirebaseUpload";
import { createRestaurant, updateRestaurant, getAllRestaurants } from "@/lib/firestore";
import { toast } from "sonner";

type Restaurant = any;

export default function RestaurantModal({ mode, restaurant, onClose, onSave }: {
  mode: "create" | "edit";
  restaurant?: Restaurant;
  onClose: () => void;
  onSave: (r: Restaurant) => void;
}) {
  const [name, setName] = useState(restaurant?.name ?? "");
  const [slug, setSlug] = useState(restaurant?.slug ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(restaurant?.logoUrl ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name ?? "");
      setSlug(restaurant.slug ?? "");
      setDescription(restaurant.description ?? "");
      setLogoUrl(restaurant.logoUrl ?? null);
    }
  }, [restaurant]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = { name, slug, description, logoUrl: logoUrl || null };
      if (mode === "create") {
        const id = await createRestaurant(payload);
        const all = await getAllRestaurants();
        const created = all.find((r: any) => r.id === id);
        toast.success("Restaurant created");
        onSave(created);
      } else {
        if (!restaurant?.id) throw new Error("Missing id");
        await updateRestaurant(restaurant.id, payload);
        const all = await getAllRestaurants();
        const updated = all.find((r: any) => r.id === restaurant.id);
        toast.success("Updated");
        onSave(updated);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Restaurant" : "Edit Restaurant"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Restaurant Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Logo</Label>
            <FirebaseUpload
              value={logoUrl}
              onChange={setLogoUrl}
              accept="image/*"
              folder="restaurants/logos"
            />

            {logoUrl && <img src={logoUrl} className="w-24 h-24 rounded mt-2" />}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : mode === "create" ? "Create" : "Update"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
