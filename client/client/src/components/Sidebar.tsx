import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const navItems = [
  { to: "/overview",        label: "Dashboard",       icon: "ti-layout-dashboard" },
  { to: "/integrations",    label: "Integrations",    icon: "ti-plug-connected"   },
  { to: "/templates",       label: "Templates",       icon: "ti-file-text"        },
  { to: "/notice-analyzer", label: "Notice Analyzer", icon: "ti-scan"             },
  { to: "/logs",            label: "Email Logs",      icon: "ti-mail"             },
  { to: "/students",        label: "Students",        icon: "ti-users"            },
  { to: "/drafts",          label: "Draft Center",    icon: "ti-edit"             },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Sidebar() {
  const location = useLocation();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";
        setUserName(name);
        setUserEmail(user.email ?? "");
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      {/* Tabler icons font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
      />

      <div
        style={{
          width: "232px",
          minHeight: "100vh",
          background: "#0F172A",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle bg glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Logo ── */}
        <div
          style={{
            padding: "22px 18px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                background: logoHovered ? "#4F46E5" : "#6366F1",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
                transform: logoHovered ? "rotate(8deg) scale(1.08)" : "rotate(0deg) scale(1)",
                boxShadow: logoHovered
                  ? "0 4px 14px rgba(99,102,241,0.45)"
                  : "0 2px 8px rgba(99,102,241,0.25)",
              }}
            >
              <i
                className="ti ti-bolt"
                style={{ fontSize: "17px", color: "#FFFFFF" }}
              />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                  letterSpacing: "-0.3px",
                  transition: "color 0.2s",
                }}
              >
                Placement SaaS
              </p>
              <p style={{ margin: 0, fontSize: "10px", color: "#475569", letterSpacing: "0.04em" }}>
                Communication Platform
              </p>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#334155",
              padding: "4px 10px",
              margin: "0 0 6px",
            }}
          >
            Navigation
          </p>

          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            const isHovered = hoveredItem === to;

            return (
              <Link
                key={to}
                to={to}
                onMouseEnter={() => setHoveredItem(to)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  marginBottom: "2px",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#FFFFFF" : isHovered ? "#E2E8F0" : "#94A3B8",
                  background: isActive
                    ? "#6366F1"
                    : isHovered
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  position: "relative",
                  transform: isHovered && !isActive ? "translateX(3px)" : "translateX(0px)",
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: "-10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "60%",
                      background: "#818CF8",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}

                <i
                  className={`ti ${icon}`}
                  style={{
                    fontSize: "17px",
                    color: isActive ? "#C7D2FE" : isHovered ? "#A5B4FC" : "#475569",
                    transition: "color 0.15s",
                    flexShrink: 0,
                  }}
                />
                {label}

                {/* Hover arrow */}
                {isHovered && !isActive && (
                  <i
                    className="ti ti-chevron-right"
                    style={{
                      fontSize: "13px",
                      color: "#6366F1",
                      marginLeft: "auto",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── User card at bottom ── */}
        <div
          style={{
            margin: "10px",
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {getInitials(userName)}
          </div>

          {/* Name + email */}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#E2E8F0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "10.5px",
                color: "#475569",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userEmail}
            </p>
          </div>

          {/* Settings icon */}
          <Link
            to="/settings"
            style={{ color: "#475569", lineHeight: 1, flexShrink: 0 }}
            title="Settings"
          >
            <i
              className="ti ti-settings"
              style={{
                fontSize: "16px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A5B4FC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#475569")}
            />
          </Link>
        </div>
      </div>
    </>
  );
}