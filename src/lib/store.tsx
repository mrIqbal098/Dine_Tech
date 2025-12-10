"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "./services/apiService";

type Restaurant = any;
type MenuItem = any;

type StoreShape = {
  restaurants: Restaurant[] | null;
  menuItems: MenuItem[] | null;
  loading: boolean;
  error: string | null;
  loadRestaurants: () => Promise<void>;
  loadMenuItems: (restaurantId: number | string) => Promise<void>;
};

const StoreContext = createContext<StoreShape | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRestaurants() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRestaurants();
      setRestaurants(data);
    } catch (err: any) {
      setError(err.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }

  async function loadMenuItems(restaurantId: number | string) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMenuItems(restaurantId);
      setMenuItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // optionally pre-load restaurants
  }, []);

  const value: StoreShape = {
    restaurants,
    menuItems,
    loading,
    error,
    loadRestaurants,
    loadMenuItems,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
