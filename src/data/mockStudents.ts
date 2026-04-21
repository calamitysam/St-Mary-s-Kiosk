export type StudentRecord = {
  id: string;
  name: string;
  className: string;
  teacher: string;
  rollNo: string;
};

/** Replace with Firestore reads when you connect Firebase. */
export const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: "s1",
    name: "Aisha Khan",
    className: "Grade 10 — A",
    teacher: "Mr. Patel",
    rollNo: "1001",
  },
  {
    id: "s2",
    name: "Jordan Lee",
    className: "Grade 9 — B",
    teacher: "Ms. Rivera",
    rollNo: "0924",
  },
  {
    id: "s3",
    name: "Samira Hassan",
    className: "Grade 11 — C",
    teacher: "Mr. Okafor",
    rollNo: "1142",
  },
];

export function searchMockStudents(query: string): StudentRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_STUDENTS;
  return MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q),
  );
}
