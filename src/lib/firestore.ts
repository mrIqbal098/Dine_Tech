// src/lib/firestore.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/server/firebase";

export async function createRestaurant(data: any) {
  const ref = await addDoc(collection(db, "restaurants"), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

export async function getAllRestaurants() {
  const snap = await getDocs(query(collection(db, "restaurants"), orderBy("name")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRestaurantBySlug(slug: string) {
  const q = query(collection(db, "restaurants"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as any;
}

export async function getRestaurantById(id: string) {
  const d = await getDoc(doc(db, "restaurants", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as any;
}

export async function updateRestaurant(id: string, data: any) {
  await updateDoc(doc(db, "restaurants", id), { ...data, updatedAt: Date.now() });
}

export async function deleteRestaurant(id: string) {
  await deleteDoc(doc(db, "restaurants", id));
}

/* menu items subcollection */
export async function addMenuItem(restaurantId: string, data: any) {
  const ref = await addDoc(collection(db, `restaurants/${restaurantId}/menuItems`), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

export async function getMenuItems(restaurantId: string) {
  const snap = await getDocs(collection(db, `restaurants/${restaurantId}/menuItems`));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function getMenuItemById(restaurantId: string, itemId: string) {
  const d = await getDoc(doc(db, `restaurants/${restaurantId}/menuItems/${itemId}`));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as any;
}

export async function updateMenuItem(restaurantId: string, itemId: string, data: any) {
  await updateDoc(doc(db, `restaurants/${restaurantId}/menuItems/${itemId}`), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteMenuItem(restaurantId: string, itemId: string) {
  await deleteDoc(doc(db, `restaurants/${restaurantId}/menuItems/${itemId}`));
}
