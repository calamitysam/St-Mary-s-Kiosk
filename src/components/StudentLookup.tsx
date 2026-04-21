import { useMemo, useState } from "react";
import { searchMockStudents, type StudentRecord } from "../data/mockStudents";

type Props = {
  onBack: () => void;
};

export function StudentLookup({ onBack }: Props) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchMockStudents(query), [query]);

  return (
    <div className="panel-overlay" role="dialog" aria-modal="true" aria-label="Student lookup">
      <div className="panel-card">
        <header className="panel-header">
          <h1 className="panel-title">Student details</h1>
          <p className="panel-sub">
            Demo data for now. Later this list can load from your Firebase project.
          </p>
        </header>
        <label className="field-label" htmlFor="student-search">
          Search by name or roll number
        </label>
        <input
          id="student-search"
          className="field-input"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="e.g. Aisha or 1001"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="student-list">
          {results.map((s) => (
            <StudentRow key={s.id} student={s} />
          ))}
        </ul>
        {results.length === 0 && <p className="empty-hint">No matches.</p>}
        <button type="button" className="menu-btn ghost panel-back" onClick={onBack}>
          Back to menu
        </button>
      </div>
    </div>
  );
}

function StudentRow({ student }: { student: StudentRecord }) {
  return (
    <li className="student-row">
      <div className="student-name">{student.name}</div>
      <div className="student-meta">
        <span>{student.className}</span>
        <span className="dot" aria-hidden>
          ·
        </span>
        <span>Teacher: {student.teacher}</span>
        <span className="dot" aria-hidden>
          ·
        </span>
        <span>Roll {student.rollNo}</span>
      </div>
    </li>
  );
}
