import { apiFetch } from "../api";

export async function getRestaurants() {
  const res = await apiFetch(`/api/restaurants`);
  if (!res.ok) throw new Error(`Failed to load restaurants: ${res.status}`);
  return res.json();
}

export async function getRestaurantBySlug(slug: string) {
  const res = await apiFetch(`/api/restaurants/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to load restaurant ${slug}: ${res.status}`);
  return res.json();
}

export async function getMenuItems(restaurantId: number | string) {
  const res = await apiFetch(`/api/menu-items?restaurantId=${encodeURIComponent(String(restaurantId))}`);
  if (!res.ok) throw new Error(`Failed to load menu items: ${res.status}`);
  return res.json();
}

export async function getMenuItemById(id: number | string) {
  const res = await apiFetch(`/api/menu-items/${encodeURIComponent(String(id))}`);
  if (!res.ok) throw new Error(`Failed to load menu item ${id}: ${res.status}`);
  return res.json();
}
