import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { signOut } from "../services/auth.service";
import { getDashboardOverview } from "../services/dashboardOverview.service";

interface DashboardData {
  students: number;
  drafts: number;
  emails: number;
  integrations: Array<{ provider: string; status: boolean }>;
  recentLogs: Array<{
    id: string;
    company: string;
    recipients_count: number;
    status: string;
    created_at: string;
  }>;
}

const INTEGRATIONS_META = [
  { key: "openrouter", name: "OpenRouter", icon: "🔁" },
  { key: "gemini",    name: "Gemini",    icon: "✦" },
  { key: "smtp",      name: "SMTP",      icon: "📬" },
  { key: "brevo",     name: "Brevo",     icon: "📡" },
];

const QUICK_ACTIONS = [
  { icon: "🔍", label: "Analyze",  desc: "Notices",       path: "/notice-analyzer" },
  { icon: "✏️",  label: "Drafts",   desc: "Create & manage", path: "/drafts" },
  { icon: "🎓", label: "Students", desc: "View all",      path: "/students" },
  { icon: "📊", label: "Logs",     desc: "Email activity", path: "/logs" },
  { icon: "🔌", label: "APIs",     desc: "Connect",       path: "/integrations" },
];

const s: Record<string, React.CSSProperties> = {
  /* ── layout ── */
  page: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 900,
  },
  topBar: {
    height: 3,
    borderRadius: 2,
    background: "linear-gradient(90deg,#6366f1 0%,#8b5cf6 35%,#06b6d4 65%,#10b981 100%)",
    marginBottom: 28,
  },

  /* ── header ── */
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 28,
  },
  h1: {
    fontSize: 24, fontWeight: 800, margin: 0,
    letterSpacing: "-0.5px", color: "#111827",
  },
  subtitle: { fontSize: 13, color: "#9ca3af", marginTop: 3, fontWeight: 400 },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },

  /* ── status pill ── */
  pillOperational: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 12px", borderRadius: 20,
    background: "#ecfdf5", color: "#065f46",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.3px",
  },
  pillWarning: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 12px", borderRadius: 20,
    background: "#fef3c7", color: "#92400e",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.3px",
  },
  statusDot: { width: 7, height: 7, borderRadius: "50%" },

  /* ── buttons ── */
  btnLogout: {
    padding: "7px 14px", borderRadius: 8,
    border: "1px solid #e5e7eb", background: "#fff",
    color: "#ef4444", fontSize: 13, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5,
  },
  btnManage: {
    width: "100%", marginTop: 12, padding: "9px 0",
    borderRadius: 8, border: "1px solid #6366f1",
    background: "transparent", color: "#6366f1",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },

  /* ── section label ── */
  sectionLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.8px",
    textTransform: "uppercase" as const, color: "#9ca3af", marginBottom: 10,
  },

  /* ── kpi grid ── */
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 10, marginBottom: 20,
  },
  kpiCard: {
    background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 12, padding: 16, position: "relative" as const,
    overflow: "hidden", transition: "all 0.15s ease",
  },
  kpiAccent: {
    position: "absolute" as const, top: 0, left: 0, right: 0,
    height: 2, borderRadius: "2px 2px 0 0",
  },
  kpiIcon:  { fontSize: 18, marginBottom: 10 },
  kpiLabel: { fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 1 },
  kpiSub:   { fontSize: 10, color: "#d1d5db", marginBottom: 6 },
  kpiVal:   {
    fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "#111827",
  },

  /* ── two-col ── */
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 14, marginBottom: 20,
  },

  /* ── card ── */
  card: {
    background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 12, padding: 18,
  },
  cardTitle: {
    fontSize: 13, fontWeight: 700, color: "#111827",
    marginBottom: 14, display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  cardTitleMeta: { fontSize: 11, color: "#9ca3af", fontWeight: 400 },

  /* ── health ── */
  healthScoreRow: { display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 12 },
  healthNum: {
    fontSize: 38, fontWeight: 800, letterSpacing: "-1.5px",
    color: "#6366f1", lineHeight: 1,
  },
  healthPct: { fontSize: 16, fontWeight: 600, color: "#9ca3af", marginBottom: 4 },
  healthBarWrap: {
    height: 6, borderRadius: 3, background: "#f3f4f6",
    marginBottom: 16, overflow: "hidden",
  },
  healthBarFill: {
    height: "100%", borderRadius: 3,
    background: "linear-gradient(90deg,#6366f1,#10b981)",
    transition: "width 0.6s ease",
  },

  /* ── integration chips ── */
  chip: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 8,
    padding: "8px 10px", borderRadius: 8,
    border: "1px solid #f3f4f6", background: "#f9fafb",
    marginBottom: 7, fontSize: 12,
  },
  chipName:    { fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: 6 },
  chipActive:  { fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#ecfdf5", color: "#065f46" },
  chipOffline: { fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb" },

  /* ── quick actions ── */
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
    gap: 8,
  },
  actionBtn: {
    background: "#f9fafb", border: "1px solid #e5e7eb",
    borderRadius: 8, padding: "14px 10px",
    cursor: "pointer", textAlign: "center" as const,
    transition: "all 0.15s ease",
  },
  actionIcon:  { fontSize: 20, marginBottom: 6 },
  actionLabel: { fontSize: 11, fontWeight: 700, color: "#111827", display: "block" },
  actionDesc:  { fontSize: 10, color: "#9ca3af", marginTop: 2, display: "block" },

  /* ── table ── */
  tableWrap: { overflowX: "auto" as const },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 12 },
  th: {
    textAlign: "left" as const, fontSize: 10,
    fontWeight: 700, letterSpacing: "0.5px",
    textTransform: "uppercase" as const, color: "#9ca3af",
    padding: "0 10px 10px",
  },
  td: { padding: 10, borderTop: "1px solid #f3f4f6", color: "#374151" },

  /* ── workspace summary ── */
  wsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  wsItem: {
    background: "#f9fafb", borderRadius: 8,
    padding: "14px 12px", textAlign: "center" as const,
  },
  wsNum:   { fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#6366f1" },
  wsLabel: { fontSize: 10, color: "#9ca3af", marginTop: 3, fontWeight: 500 },

  /* ── empty state ── */
  empty: { textAlign: "center" as const, padding: "32px 20px", color: "#9ca3af", fontSize: 13 },

  /* ── loading ── */
  loadingWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "60px 20px", color: "#6b7280", fontSize: 14,
  },
  loadingDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#6366f1", animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const dashboardData = await getDashboardOverview();
      setData(dashboardData || empty());
    } catch {
      setData(empty());
    } finally {
      setLoading(false);
    }
  }

  function empty(): DashboardData {
    return { students: 0, drafts: 0, emails: 0, integrations: [], recentLogs: [] };
  }

  async function handleLogout() {
    try { await signOut(); navigate("/"); }
    catch (e) { console.error("Logout failed", e); }
  }

  const norm = (v: any) => v === true || v === "true";
  const connectedCount = data?.integrations?.filter(i => norm(i.status)).length ?? 0;
  const total = data?.integrations?.length ?? 0;
  const healthScore = total > 0 ? Math.round((connectedCount / total) * 100) : 0;
  const isOperational = connectedCount > 0;

  const getStatus = (key: string) =>
    data?.integrations?.some(i => i.provider?.toLowerCase() === key && norm(i.status)) ?? false;

  const kpiAccents = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];
  const kpis = [
    { label: "Students",  sub: "Registered", value: data?.students ?? 0,  icon: "🎓" },
    { label: "Drafts",    sub: "Generated",  value: data?.drafts   ?? 0,  icon: "📝" },
    { label: "Emails sent", sub: "Delivered", value: data?.emails  ?? 0,  icon: "📤" },
    { label: "APIs",      sub: "Connected",  value: connectedCount,        icon: "🔌" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      success: { bg: "#ecfdf5", color: "#065f46" },
      pending: { bg: "#fef3c7", color: "#92400e" },
      error:   { bg: "#fee2e2", color: "#991b1b" },
    };
    const st = map[status] ?? map.error;
    return (
      <span style={{
        display: "inline-block", padding: "3px 8px", borderRadius: 6,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
        background: st.bg, color: st.color,
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
        <div style={s.loadingWrap}>
          <div style={s.loadingDot} />
          Loading dashboard…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media (max-width: 600px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
          .ws-grid      { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div style={s.page}>

        {/* ── gradient top bar ── */}
        <div style={s.topBar} />

        {/* ── header ── */}
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>Welcome back 👋</h1>
            <p style={s.subtitle}>Placement Communication SaaS · Overview</p>
          </div>
          <div style={s.headerRight}>
            <div style={isOperational ? s.pillOperational : s.pillWarning}>
              <div style={{ ...s.statusDot, background: isOperational ? "#10b981" : "#f59e0b" }} />
              {isOperational ? "Operational" : "Setup required"}
            </div>
            <button
              style={s.btnLogout}
              onClick={handleLogout}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
            >
              ↩ Logout
            </button>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div style={s.sectionLabel}>At a glance</div>
        <div style={s.kpiGrid}>
          {kpis.map((k, i) => (
            <div
              key={i} style={s.kpiCard}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div style={{ ...s.kpiAccent, background: kpiAccents[i] }} />
              <div style={s.kpiIcon}>{k.icon}</div>
              <div style={s.kpiLabel}>{k.label}</div>
              <div style={s.kpiSub}>{k.sub}</div>
              <div style={s.kpiVal}>{k.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* ── health + quick actions ── */}
        <div style={s.twoCol} className="two-col-grid">

          {/* system health */}
          <div style={s.card}>
            <div style={s.cardTitle}>
              System health
              <span style={s.cardTitleMeta}>{total} integrations</span>
            </div>
            <div style={s.healthScoreRow}>
              <div style={s.healthNum}>{healthScore}</div>
              <div style={s.healthPct}>%</div>
            </div>
            <div style={s.healthBarWrap}>
              <div style={{ ...s.healthBarFill, width: `${healthScore}%` }} />
            </div>
            {INTEGRATIONS_META.map(({ key, name, icon }) => {
              const connected = getStatus(key);
              return (
                <div key={key} style={s.chip}>
                  <span style={s.chipName}><span>{icon}</span> {name}</span>
                  <span style={connected ? s.chipActive : s.chipOffline}>
                    {connected ? "Active" : "Offline"}
                  </span>
                </div>
              );
            })}
            <button
              style={s.btnManage}
              onClick={() => navigate("/integrations")}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              ⚙ Manage integrations
            </button>
          </div>

          {/* quick actions */}
          <div style={s.card}>
            <div style={s.cardTitle}>Quick actions</div>
            <div style={s.actionsGrid}>
              {QUICK_ACTIONS.map((a, i) => (
                <button
                  key={i} style={s.actionBtn}
                  onClick={() => navigate(a.path)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  <div style={s.actionIcon}>{a.icon}</div>
                  <span style={s.actionLabel}>{a.label}</span>
                  <span style={s.actionDesc}>{a.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── recent email activity ── */}
        <div style={{ ...s.card, marginBottom: 20 }}>
          <div style={s.cardTitle}>
            Recent email activity
            <span style={s.cardTitleMeta}>Last 5 campaigns</span>
          </div>

          {data?.recentLogs && data.recentLogs.length > 0 ? (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Company", "Recipients", "Status", "Date"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentLogs.slice(0, 5).map(log => (
                    <tr
                      key={log.id}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#f9fafb"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      <td style={{ ...s.td, fontWeight: 600 }}>{log.company}</td>
                      <td style={s.td}>{log.recipients_count.toLocaleString()}</td>
                      <td style={s.td}>{statusBadge(log.status)}</td>
                      <td style={{ ...s.td, color: "#9ca3af" }}>
                        {new Date(log.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={s.empty}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📨</div>
              No email activity yet
            </div>
          )}
        </div>

        {/* ── workspace summary ── */}
        <div style={s.card}>
          <div style={{ ...s.cardTitle, marginBottom: 16 }}>Workspace summary</div>
          <div style={s.wsGrid} className="ws-grid">
            {[
              { label: "Total students",  value: data?.students    ?? 0 },
              { label: "Active drafts",   value: data?.drafts      ?? 0 },
              { label: "Emails sent",     value: data?.emails      ?? 0 },
              { label: "Connected APIs",  value: connectedCount },
            ].map((item, i) => (
              <div key={i} style={s.wsItem}>
                <div style={s.wsNum}>{item.value.toLocaleString()}</div>
                <div style={s.wsLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}