type Props = {
  onStudentDetails: () => void;
  onFeeStructure: () => void;
  onClose: () => void;
};

export function MainMenu({ onStudentDetails, onFeeStructure, onClose }: Props) {
  return (
    <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="menu-card">
        <h1 className="menu-title">Welcome to St Mary's English School</h1>
        <p className="menu-sub">Choose a desired option</p>
        <div className="menu-actions">
          <button type="button" className="menu-btn primary" onClick={onStudentDetails}>
            Find student details (class teacher,class etc)
          </button>
          <button type="button" className="menu-btn" onClick={onFeeStructure}>
            Fee structure
          </button>
        </div>
        <button type="button" className="menu-btn ghost" onClick={onClose}>
          Back to documentary
        </button>
      </div>
    </div>
  );
}
