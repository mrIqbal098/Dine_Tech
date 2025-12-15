"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/lib/useFirebaseAuth";

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/admin/login");
    else router.replace("/admin/dashboard");
  }, [user, loading, router]);

  return null;
}
