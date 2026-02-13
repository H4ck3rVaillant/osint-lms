export default function ModuleValidatedModal({
  title,
  subtitle,
  onConfirm,
}: {
  title: string;
  subtitle: string;
  onConfirm: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#0b0f1a",
          border: "1px solid #00ff9c",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#00ff9c", marginBottom: "10px" }}>{title}</h2>
        <p style={{ color: "#9ca3af", marginBottom: "25px" }}>{subtitle}</p>

        <button
          onClick={onConfirm}
          style={{
            background: "#00ff9c",
            color: "#000",
            padding: "12px 28px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Retour au Dashboard
        </button>
      </div>
    </div>
  );
}
