import { useEffect, useState } from "react";
import { fetchFeeContentFromFirestore } from "../lib/feeFirestore";
import { isFirebaseWebConfigPresent } from "../lib/firebaseClient";

type Props = {
  onBack: () => void;
};

type ParsedFeeContent = {
  headingLines: string[];
  sectionTitle?: string;
  tableRows?: string[][];
  fallbackText?: string;
};

const PLACEHOLDER_COPY =
  "Add tuition bands, payment deadlines, and contact information here. When Firebase is connected, the text comes from your database instead.";

function splitRow(line: string) {
  const cells = line.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
  return cells.length > 0 ? cells : [line];
}

function parseFeeContent(body: string): ParsedFeeContent {
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headingLines: string[] = [];
  const tableRows: string[][] = [];
  let sectionTitle: string | undefined;
  let startedTable = false;

  for (const line of lines) {
    if (!startedTable && /instalment/i.test(line)) {
      startedTable = true;
      tableRows.push(splitRow(line));
      continue;
    }

    if (!startedTable && /fee details/i.test(line)) {
      sectionTitle = line;
      continue;
    }

    if (startedTable) {
      tableRows.push(splitRow(line));
      continue;
    }

    headingLines.push(line);
  }

  if (tableRows.length === 0) {
    return { headingLines, sectionTitle, fallbackText: body };
  }

  return { headingLines, sectionTitle, tableRows };
}

export function FeeStructure({ onBack }: Props) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(() =>
    isFirebaseWebConfigPresent() ? "loading" : "ready",
  );
  const [body, setBody] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isFirebaseWebConfigPresent()) {
      setStatus("ready");
      setBody(null);
      return () => { cancelled = true; };
    }

    setStatus("loading");
    fetchFeeContentFromFirestore()
      .then((text) => {
        if (cancelled) return;
        setBody(text);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => { cancelled = true; };
  }, []);

  const showFirebaseHint = !isFirebaseWebConfigPresent();
  const parsedBody = body ? parseFeeContent(body) : null;
  const headers = parsedBody?.tableRows?.[0] ?? [];
  const dataRows = parsedBody?.tableRows?.slice(1) ?? [];

  return (
    <div className="panel-overlay" role="dialog" aria-modal="true" aria-label="Fee structure">
      <div className="panel-card">
        <header className="panel-header">
          <h1 className="panel-title">Fee structure</h1>
          {showFirebaseHint && (
            <p className="panel-sub">Showing on-screen placeholder until Firebase is connected.</p>
          )}
          {!showFirebaseHint && status !== "error" && (
            <p className="panel-sub">Pulled from your Firebase project.</p>
          )}
          {status === "error" && (
            <p className="panel-sub error-text">Could not load fees. Check your internet and Firebase setup.</p>
          )}
        </header>
        {status === "loading" && <p className="fee-loading">Loading…</p>}
        {status === "ready" && (
          <div className="fee-placeholder fee-body">
            {body && parsedBody?.tableRows ? (
              <div>
                <div className="fee-heading">
                  {parsedBody.headingLines.slice(0, 2).map((line, index) => (
                    <p key={index} className={index === 0 ? "fee-heading-main" : "fee-heading-sub"}>
                      {line}
                    </p>
                  ))}
                  {parsedBody.sectionTitle && (
                    <p className="fee-heading-section">{parsedBody.sectionTitle}</p>
                  )}
                </div>

                {/* Card layout for portrait */}
                <div className="fee-cards">
                  {dataRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="fee-card">
                      <p className="fee-card-title">{row[0]}</p>
                      {headers.slice(1).map((header, i) => (
                        <div key={i} className="fee-card-row">
                          <span className="fee-card-label">{header}</span>
                          <span className="fee-card-value">{row[i + 1] ?? "—"}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Table layout for landscape */}
                <div className="fee-table-wrapper">
                  <table className="fee-table">
                    <thead>
                      <tr>
                        {headers.map((cell, index) => (
                          <th key={index}>{cell}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : body ? (
              <pre className="fee-text" aria-label="Fee content">{parsedBody?.fallbackText ?? body}</pre>
            ) : isFirebaseWebConfigPresent() ? (
              <p>
                Firebase is connected, but no text was found. In Firestore, create collection{" "}
                <code>kiosk</code>, document <code>fees</code>, and a string field named{" "}
                <code>content</code> with your fee text (see FEE_SETUP.txt).
              </p>
            ) : (
              <p>{PLACEHOLDER_COPY}</p>
            )}
          </div>
        )}
        {status === "error" && (
          <div className="fee-placeholder fee-body">
            <p>{PLACEHOLDER_COPY}</p>
          </div>
        )}
        <button type="button" className="menu-btn ghost panel-back" onClick={onBack}>
          Back to menu
        </button>
      </div>
    </div>
  );
}