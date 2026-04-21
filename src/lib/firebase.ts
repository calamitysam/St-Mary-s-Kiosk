/**
 * Firebase wiring goes here later (initializeApp, getFirestore, etc.).
 * Keep student reads behind a small module so UI code does not change much.
 */

export async function fetchStudentById(id: string) {
  void id;
  throw new Error("Firebase not configured yet. Using mock data in the UI.");
}
