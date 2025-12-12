import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { isSupported, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDn0sBOdDJ8MCBkaGN_0P-Tj-hV5raMXCo",
  authDomain: "dinetech-2d402.firebaseapp.com",
  projectId: "dinetech-2d402",
  storageBucket: "dinetech-2d402.appspot.com",
  messagingSenderId: "377153917170",
  appId: "1:377153917170:web:b3559f130951dee80b006b",
  measurementId: "G-NYNS3J7PK8"
};

export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

//  MISSING PART FIXED — Auth initialized here
export const auth = getAuth(app);

// Analytics only if supported
isSupported().then((ok) => ok && getAnalytics(app));
