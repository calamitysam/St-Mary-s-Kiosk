import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

function readEnv(key: string) {
  const v = import.meta.env[key as keyof ImportMetaEnv];
  return typeof v === "string" ? v.trim() : "";
}

export function isFirebaseWebConfigPresent() {
  return Boolean(readEnv("VITE_FIREBASE_API_KEY") && readEnv("VITE_FIREBASE_PROJECT_ID"));
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseWebConfigPresent()) return null;

  if (!getApps().length) {
    app = initializeApp({
      apiKey: readEnv("VITE_FIREBASE_API_KEY"),
      authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
      projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
      storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
      appId: readEnv("VITE_FIREBASE_APP_ID"),
    });
  }

  const a = app ?? getApps()[0];
  if (!a) return null;
  if (!db) db = getFirestore(a);
  return db;
}
