import { useEffect, useState, useRef } from "react";
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
  { key: "gemini",     name: "Gemini",     icon: "✦"  },
  { key: "smtp",       name: "SMTP",       icon: "📬" },
  { key: "brevo",      name: "Brevo",      icon: "📡" },
];

const QUICK_ACTIONS = [
  { icon: "🔍", label: "Analyze",  desc: "Notices",         path: "/notice-analyzer" },
  { icon: "✏️",  label: "Drafts",   desc: "Create & manage", path: "/drafts"          },
  { icon: "🎓", label: "Students", desc: "View all",        path: "/students"        },
  { icon: "📊", label: "Logs",     desc: "Email activity",  path: "/logs"            },
  { icon: "🔌", label: "APIs",     desc: "Connect",         path: "/integrations"    },
];

/* ── Pop-up overlay container ── */
function PopCard({
  open, onClose, title, children, anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const winW = window.innerWidth;
      const popW = 280;
      let left = rect.left;
      if (left + popW > winW - 16) left = winW - popW - 16;
      setPos({ top: rect.bottom + scrollY + 6, left });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  if (!open) return null;
  return (
    <div
      ref={popRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: 280,
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 14,
        boxShadow: "0 20px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(99,102,241,0.15)",
        zIndex: 999,
        animation: "popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "11px 14px 10px",
        borderBottom: "1px solid #334155",
        background: "#172033",
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.02em" }}>{title}</span>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", color: "#475569",
            cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px",
          }}
        >×</button>
      </div>
      <div style={{ padding: "10px 14px 14px" }}>{children}</div>
    </div>
  );
}

/* ── Compact KPI card with pop-up ── */
function KpiCard({
  label, sub, value, icon, accent, popTitle, popContent, delay,
}: {
  label: string; sub: string; value: number; icon: string; accent: string;
  popTitle: string; popContent: React.ReactNode; delay: number;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div
        ref={ref}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: open ? "#1E293B" : hovered ? "#1A2740" : "#172033",
          border: `1px solid ${open || hovered ? accent + "55" : "#1E2A40"}`,
          borderRadius: 12,
          padding: "12px 14px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: visible ? (hovered || open ? "translateY(-3px)" : "translateY(0)") : "translateY(8px)",
          opacity: visible ? 1 : 0,
          boxShadow: hovered || open ? `0 8px 24px ${accent}22` : "none",
          userSelect: "none",
        }}
      >
        {/* top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: hovered || open ? 1 : 0, transition: "opacity 0.2s",
        }} />
        {/* shimmer */}
        <div style={{
          position: "absolute", top: 0,
          left: hovered ? "110%" : "-60%",
          width: "50%", height: "100%",
          background: `linear-gradient(105deg, transparent 40%, ${accent}14 50%, transparent 60%)`,
          transition: hovered ? "left 0.5s ease" : "none",
          pointerEvents: "none",
        }} />
        {/* glow orb */}
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 60, height: 60, borderRadius: "50%",
          background: accent + (hovered ? "20" : "0a"),
          filter: "blur(16px)", transition: "background 0.3s",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{
            fontSize: 9, fontWeight: 600, color: accent,
            opacity: hovered || open ? 1 : 0,
            transition: "opacity 0.2s",
            letterSpacing: "0.05em",
          }}>VIEW ▾</span>
        </div>
        <div style={{
          fontSize: 26, fontWeight: 800, letterSpacing: "-1px",
          color: hovered || open ? accent : "#E2E8F0",
          transition: "color 0.2s", fontVariantNumeric: "tabular-nums",
          lineHeight: 1, marginBottom: 4,
        }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{label}</div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{sub}</div>
      </div>

      <PopCard
        open={open}
        onClose={() => setOpen(false)}
        title={popTitle}
        anchorRef={ref}
      >
        {popContent}
      </PopCard>
    </>
  );
}

/* ── Compact action button ── */
function ActionBtn({ icon, label, desc, onClick }: {
  icon: string; label: string; desc: string; onClick: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? "#1E2D45" : "#172033",
        border: `1px solid ${h ? "#6366F155" : "#1E2A40"}`,
        borderRadius: 10,
        padding: "10px 6px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.18s ease",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h ? "0 6px 16px rgba(99,102,241,0.18)" : "none",
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: h ? "#A5B4FC" : "#94A3B8", display: "block", transition: "color 0.18s" }}>{label}</div>
      <div style={{ fontSize: 9, color: "#475569", marginTop: 1, display: "block" }}>{desc}</div>
    </button>
  );
}

/* ── Integration chip ── */
function IntChip({ name, icon, connected }: { name: string; icon: string; connected: boolean }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "7px 10px", borderRadius: 8,
        background: h ? "#1E293B" : "transparent",
        border: `1px solid ${h ? "#334155" : "#1E2A40"}`,
        marginBottom: 5, transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 500, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span>{name}
      </span>
      <span style={{
        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
        background: connected ? "#052E16" : "#1C1917",
        color: connected ? "#4ADE80" : "#57534E",
        border: `1px solid ${connected ? "#14532D" : "#292524"}`,
      }}>
        {connected ? "● Live" : "○ Off"}
      </span>
    </div>
  );
}

/* ── Log row ── */
function LogRow({ log }: { log: DashboardData["recentLogs"][0] }) {
  const [h, setH] = useState(false);
  const stMap: Record<string, [string, string, string]> = {
    success: ["#052E16", "#4ADE80", "#14532D"],
    pending: ["#1C1400", "#FBBF24", "#292524"],
    error:   ["#1C0A0A", "#F87171", "#7F1D1D"],
  };
  const [bg, color, border] = stMap[log.status] ?? stMap.error;
  return (
    <tr
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: h ? "#1A2744" : "transparent", transition: "background 0.12s" }}
    >
      <td style={{ padding: "8px 12px", color: "#E2E8F0", fontWeight: 600, fontSize: 12, borderTop: "1px solid #1E293B" }}>{log.company}</td>
      <td style={{ padding: "8px 12px", color: "#94A3B8", fontSize: 12, borderTop: "1px solid #1E293B" }}>{log.recipients_count.toLocaleString()}</td>
      <td style={{ padding: "8px 12px", borderTop: "1px solid #1E293B" }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: bg, color, border: `1px solid ${border}` }}>
          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
        </span>
      </td>
      <td style={{ padding: "8px 12px", color: "#475569", fontSize: 11, borderTop: "1px solid #1E293B" }}>
        {new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
      </td>
    </tr>
  );
}

/* ── Main ── */
export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const healthRef = useRef<HTMLDivElement>(null);
  
  const logsRef = useRef<HTMLDivElement>(null);
  const [healthOpen, setHealthOpen] = useState(false);
  
  const [logsOpen, setLogsOpen] = useState(false);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const d = await getDashboardOverview();
      setData(d || empty());
    } catch { setData(empty()); }
    finally { setLoading(false); }
  }

  function empty(): DashboardData {
    return { students: 0, drafts: 0, emails: 0, integrations: [], recentLogs: [] };
  }

  async function handleLogout() {
    try { await signOut(); navigate("/"); }
    catch (e) { console.error(e); }
  }

  const norm = (v: any) => v === true || v === "true";
  const connectedCount = data?.integrations?.filter(i => norm(i.status)).length ?? 0;
  const total = data?.integrations?.length ?? 0;
  const healthScore = total > 0 ? Math.round((connectedCount / total) * 100) : 0;
  const isOperational = connectedCount > 0;
  const getStatus = (key: string) =>
    data?.integrations?.some(i => i.provider?.toLowerCase() === key && norm(i.status)) ?? false;

  const kpis = [
    {
      label: "Students", sub: "Registered", value: data?.students ?? 0, icon: "🎓", accent: "#6366F1",
      popTitle: "Students overview",
      popContent: (
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#6366F1", fontVariantNumeric: "tabular-nums" }}>{data?.students ?? 0}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Total registered students</div>
          <button onClick={() => navigate("/students")} style={{
            width: "100%", padding: "8px 0", borderRadius: 8,
            background: "#6366F1", color: "#fff", border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Go to Students →</button>
        </div>
      ),
    },
    {
      label: "Drafts", sub: "Generated", value: data?.drafts ?? 0, icon: "📝", accent: "#8B5CF6",
      popTitle: "Drafts overview",
      popContent: (
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#8B5CF6", fontVariantNumeric: "tabular-nums" }}>{data?.drafts ?? 0}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Email drafts generated</div>
          <button onClick={() => navigate("/drafts")} style={{
            width: "100%", padding: "8px 0", borderRadius: 8,
            background: "#8B5CF6", color: "#fff", border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Go to Drafts →</button>
        </div>
      ),
    },
    {
      label: "Emails sent", sub: "Delivered", value: data?.emails ?? 0, icon: "📤", accent: "#06B6D4",
      popTitle: "Email activity",
      popContent: (
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#06B6D4", fontVariantNumeric: "tabular-nums" }}>{data?.emails ?? 0}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Total emails delivered</div>
          <button onClick={() => navigate("/logs")} style={{
            width: "100%", padding: "8px 0", borderRadius: 8,
            background: "#0891B2", color: "#fff", border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>View logs →</button>
        </div>
      ),
    },
    {
      label: "APIs", sub: "Connected", value: connectedCount, icon: "🔌", accent: "#10B981",
      popTitle: "API integrations",
      popContent: (
        <div>
          {INTEGRATIONS_META.map(({ key, name, icon }) => (
            <IntChip key={key} name={name} icon={icon} connected={getStatus(key)} />
          ))}
          <button onClick={() => navigate("/integrations")} style={{
            width: "100%", marginTop: 8, padding: "8px 0", borderRadius: 8,
            background: "#059669", color: "#fff", border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Manage integrations →</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "60px 20px" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%", background: "#6366F1",
              animation: `bounce 1.1s ease ${i * 0.15}s infinite`,
            }} />
          ))}
          <span style={{ fontSize: 13, color: "#475569", marginLeft: 4 }}>Loading…</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92) translateY(-6px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
        maxWidth: 900,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>

        {/* ── Row 1: Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
          background: "#172033",
          border: "1px solid #1E2A40",
          borderRadius: 12,
          padding: "10px 16px",
          animation: "fadeUp 0.3s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: "#6366F1",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
            }}>✦</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.3px" }}>
                Placement SaaS
              </div>
              <div style={{ fontSize: 10, color: "#475569" }}>Overview · Dashboard</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* system health pill — clickable */}
            <div ref={healthRef} onClick={() => { setHealthOpen(o => !o); setLogsOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 99,
              background: isOperational ? "#052E16" : "#1C1400",
              border: `1px solid ${isOperational ? "#14532D" : "#292524"}`,
              fontSize: 11, fontWeight: 600,
              color: isOperational ? "#4ADE80" : "#FBBF24",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: isOperational ? "#4ADE80" : "#FBBF24",
                boxShadow: `0 0 5px ${isOperational ? "#4ADE80" : "#FBBF24"}`,
              }} />
              {isOperational ? "Operational" : "Setup required"}
              <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
            </div>

            {/* Logout */}
            <LogoutBtn onClick={handleLogout} />
          </div>
        </div>

        {/* ── Row 2: KPI cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          animation: "fadeUp 0.35s ease 0.05s both",
        }}>
          {kpis.map((k, i) => (
            <KpiCard key={i} {...k} delay={i * 60} />
          ))}
        </div>

        {/* ── Row 3: Quick actions + Activity + Health bars ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr 1fr",
          gap: 10,
          animation: "fadeUp 0.35s ease 0.1s both",
        }}>

          {/* Quick actions */}
          <div style={{
            background: "#172033",
            border: "1px solid #1E2A40",
            borderRadius: 12,
            padding: "12px",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "#475569",
              letterSpacing: "0.07em", textTransform: "uppercase",
              marginBottom: 10,
            }}>Quick actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
              {QUICK_ACTIONS.map((a, i) => (
                <ActionBtn key={i} {...a} onClick={() => navigate(a.path)} />
              ))}
            </div>
          </div>

          {/* Recent logs — compact, click to expand */}
          <div style={{
            background: "#172033",
            border: "1px solid #1E2A40",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            <div
              ref={logsRef}
              onClick={() => { setLogsOpen(o => !o); setHealthOpen(false);  }}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                borderBottom: logsOpen ? "1px solid #1E293B" : "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1A2744")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#CBD5E1" }}>
                📨 Recent email activity
              </span>
              <span style={{ fontSize: 10, color: "#475569" }}>
                {data?.recentLogs?.length ?? 0} logs · click to view ▾
              </span>
            </div>

            {/* Mini preview — last 2 rows always visible */}
            {data?.recentLogs && data.recentLogs.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <tbody>
                  {data.recentLogs.slice(0, 2).map(log => (
                    <LogRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "16px 14px", fontSize: 11, color: "#475569", textAlign: "center" }}>
                No activity yet
              </div>
            )}
          </div>

          {/* Integrations health bar card */}
          <div style={{
            background: "#172033",
            border: "1px solid #1E2A40",
            borderRadius: 12,
            padding: "12px 14px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
              System health
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
              <span style={{
                fontSize: 34, fontWeight: 800, letterSpacing: "-1.5px",
                color: healthScore > 50 ? "#4ADE80" : "#FBBF24",
                lineHeight: 1, fontVariantNumeric: "tabular-nums",
              }}>{healthScore}</span>
              <span style={{ fontSize: 14, color: "#475569", marginBottom: 3, fontWeight: 600 }}>%</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: "#1E293B", marginBottom: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: healthScore > 50 ? "linear-gradient(90deg,#059669,#4ADE80)" : "linear-gradient(90deg,#D97706,#FBBF24)",
                width: `${healthScore}%`, transition: "width 0.8s ease",
              }} />
            </div>
            {INTEGRATIONS_META.map(({ key, name, icon }) => {
              const on = getStatus(key);
              return (
                <div key={key} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 5,
                }}>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{icon} {name}</span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, padding: "1px 7px", borderRadius: 99,
                    background: on ? "#052E16" : "#1C1917",
                    color: on ? "#4ADE80" : "#57534E",
                    border: `1px solid ${on ? "#14532D" : "#292524"}`,
                  }}>{on ? "●" : "○"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Row 4: Workspace mini tiles ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          animation: "fadeUp 0.35s ease 0.15s both",
        }}>
          {[
            { label: "Total students", value: data?.students ?? 0, color: "#6366F1", sub: "registered" },
            { label: "Active drafts",  value: data?.drafts   ?? 0, color: "#8B5CF6", sub: "generated"  },
            { label: "Emails sent",    value: data?.emails   ?? 0, color: "#06B6D4", sub: "delivered"  },
            { label: "Connected APIs", value: connectedCount,       color: "#10B981", sub: `of ${total}`},
          ].map((item, i) => (
            <WorkspaceTile key={i} {...item} />
          ))}
        </div>

      </div>

      {/* ── System health pop-up ── */}
      <PopCard open={healthOpen} onClose={() => setHealthOpen(false)} title="System health" anchorRef={healthRef}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 10 }}>
          <span style={{ fontSize: 38, fontWeight: 800, color: healthScore > 50 ? "#4ADE80" : "#FBBF24", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{healthScore}</span>
          <span style={{ fontSize: 16, color: "#475569", marginBottom: 4 }}>%</span>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: "#0F172A", marginBottom: 12, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: healthScore > 50 ? "linear-gradient(90deg,#059669,#4ADE80)" : "linear-gradient(90deg,#D97706,#FBBF24)",
            width: `${healthScore}%`, transition: "width 0.8s ease",
          }} />
        </div>
        {INTEGRATIONS_META.map(({ key, name, icon }) => (
          <IntChip key={key} name={name} icon={icon} connected={getStatus(key)} />
        ))}
        <button onClick={() => { setHealthOpen(false); navigate("/integrations"); }} style={{
          width: "100%", marginTop: 10, padding: "8px 0", borderRadius: 8,
          background: "#059669", color: "#fff", border: "none",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>Manage integrations →</button>
      </PopCard>

      {/* ── Logs pop-up ── */}
      <PopCard open={logsOpen} onClose={() => setLogsOpen(false)} title="Email activity" anchorRef={logsRef}>
        {data?.recentLogs && data.recentLogs.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                {["Company", "Rcpts", "Status", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 9, fontWeight: 700, color: "#475569", padding: "0 8px 8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentLogs.slice(0, 5).map(log => <LogRow key={log.id} log={log} />)}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#475569", fontSize: 12 }}>No logs yet</div>
        )}
        <button onClick={() => { setLogsOpen(false); navigate("/logs"); }} style={{
          width: "100%", marginTop: 10, padding: "8px 0", borderRadius: 8,
          background: "#0891B2", color: "#fff", border: "none",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>View all logs →</button>
      </PopCard>

    </DashboardLayout>
  );
}

function WorkspaceTile({ label, value, color, sub }: { label: string; value: number; color: string; sub: string }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? "#1A2744" : "#172033",
        border: `1px solid ${h ? color + "44" : "#1E2A40"}`,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "default",
        transition: "all 0.18s",
        transform: h ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: color + "18",
        border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 17, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{label}</div>
        <div style={{ fontSize: 10, color: "#475569" }}>{sub}</div>
      </div>
    </div>
  );
}

function LogoutBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "5px 12px", borderRadius: 8,
        border: `1px solid ${h ? "#7F1D1D" : "#1E293B"}`,
        background: h ? "#1C0A0A" : "transparent",
        color: h ? "#F87171" : "#64748B",
        fontSize: 12, fontWeight: 500, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 5,
        transition: "all 0.15s",
      }}
    >
      ↩ Logout
    </button>
  );
}