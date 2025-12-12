"use client";

import { useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { app } from "@/server/firebase";

const auth = getAuth(app);

export function useFirebaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    login: (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    register: (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
  };
}
