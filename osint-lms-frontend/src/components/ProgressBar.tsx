type ProgressBarProps = {
  title: string;
  total: number;
  completed: number;
};

export default function ProgressBar({
  title,
  total,
  completed,
}: ProgressBarProps) {
  const percent = Math.round((completed / total) * 100);

  return (
    <div style={{ marginBottom: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          color: "#9ca3af",
        }}
      >
        <span style={{ color: "#00ff9c", fontWeight: "bold" }}>{title}</span>
        <span>{completed} / {total}</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#020617",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #00ff9c",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#00ff9c",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
