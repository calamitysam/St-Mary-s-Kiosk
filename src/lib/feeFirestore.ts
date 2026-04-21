import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "./firebaseClient";

function readOptionalEnv(key: string, fallback: string) {
  const v = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

/**
 * Reads one string field from a single Firestore document.
 * Defaults: collection `kiosk`, document `fees`, field `content`.
 */
export async function fetchFeeContentFromFirestore(): Promise<string | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const collectionId = readOptionalEnv("VITE_FEE_COLLECTION", "kiosk");
  const documentId = readOptionalEnv("VITE_FEE_DOC_ID", "fees");
  const fieldName = readOptionalEnv("VITE_FEE_FIELD", "content");

  const snap = await getDoc(doc(db, collectionId, documentId));
  if (!snap.exists()) return null;

  const value = snap.get(fieldName);
  return typeof value === "string" ? value : null;
}
