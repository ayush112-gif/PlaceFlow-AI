interface AnalysisResultCardProps {
  title: string;
  value: string;
}

export default function AnalysisResultCard({
  title,
  value,
}: AnalysisResultCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {value || "-"}
      </h3>
    </div>
  );
}