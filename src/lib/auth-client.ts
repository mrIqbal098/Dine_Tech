"use client";
import { useEffect, useState } from "react";

export const authClient = {
  signIn: {
    email: async ({
      email,
      password,
      callbackURL,
    }: { email: string; password: string; callbackURL?: string }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { error: data.error || "Invalid credentials" };
        }

        return { error: null };
      } catch {
        return { error: "Network error" };
      }
    },
  },

  signUp: {
    email: async ({
      name,
      email,
      password,
    }: { name: string; email: string; password: string }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { error: data.error || "Registration failed" };
        }

        return { error: null };
      } catch {
        return { error: "Network error" };
      }
    },
  },

  signOut: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    return { error: null };
  },
};

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSession = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setSession(null);
        setError(null);
      } else {
        const data = await res.json();
        setSession({ user: data });
        setError(null);
      }
    } catch (err) {
      setSession(null);
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return { data: session, isPending, error, refetch: fetchSession };
}
