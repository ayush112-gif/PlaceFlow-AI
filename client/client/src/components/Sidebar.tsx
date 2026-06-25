import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>Placement SaaS</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <Link
          to="/overview"
          style={{ color: "white" }}
        >
          Dashboard
        </Link>

        <Link
          to="/integrations"
          style={{ color: "white" }}
        >
          Integrations
        </Link>
        <Link
  to="/templates"
  style={{ color: "white" }}
>
  Templates
</Link>
        <Link
          to="/notice-analyzer"
          style={{ color: "white" }}
        >
          Notice Analyzer
        </Link>
        <Link to="/logs">
  Email Logs
</Link>
      <Link to="/students">
  Students
</Link>
        <Link
          to="/drafts"
          style={{ color: "white" }}
        >
          Draft Center
        </Link>
      </div>
    </div>
  );
}