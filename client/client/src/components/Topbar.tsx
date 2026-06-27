import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/overview":        { title: "Dashboard",       description: "Overview of your placement activity" },
  "/integrations":    { title: "Integrations",    description: "Manage connected services" },
  "/templates":       { title: "Templates",       description: "Email and notice templates" },
  "/notice-analyzer": { title: "Notice Analyzer", description: "Analyze placement notices" },
  "/logs":            { title: "Email Logs",      description: "Track sent communications" },
  "/students":        { title: "Students",        description: "Manage student records" },
  "/drafts":          { title: "Draft Center",    description: "Review and edit drafts" },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Topbar() {
  const location = useLocation();
  const current = pageTitles[location.pathname] ?? {
    title: "Placement SaaS",
    description: "Placement Communication Platform",
  };

  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");
  const [bellHovered, setBellHovered] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div
      style={{
        borderBottom: "1px solid #E2E8F0",
        padding: "0 28px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FFFFFF",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left — Page title */}
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.3px",
          }}
        >
          {current.title}
        </h1>
        <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", marginTop: "1px" }}>
          {current.description}
        </p>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Welcome text */}
        <div style={{ textAlign: "right", marginRight: "4px" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
            {getGreeting()}, {userName.split(" ")[0]} 👋
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>
            {userEmail}
          </p>
        </div>

        {/* Bell */}
        <div
          onMouseEnter={() => setBellHovered(true)}
          onMouseLeave={() => setBellHovered(false)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: `1px solid ${bellHovered ? "#6366F1" : "#E2E8F0"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            color: bellHovered ? "#6366F1" : "#64748B",
            position: "relative",
            background: bellHovered ? "#EEF2FF" : "#FFFFFF",
            transition: "all 0.18s ease",
            transform: bellHovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: "7px",
              right: "8px",
              width: "7px",
              height: "7px",
              background: "#6366F1",
              borderRadius: "50%",
              border: "1.5px solid white",
            }}
          />
        </div>

        {/* Avatar + Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            onClick={() => setDropdownOpen((o) => !o)}
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: avatarHovered ? "#4F46E5" : "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.18s ease",
              transform: avatarHovered ? "scale(1.08)" : "scale(1)",
              boxShadow: avatarHovered
                ? "0 4px 12px rgba(99,102,241,0.4)"
                : "0 2px 6px rgba(99,102,241,0.2)",
              userSelect: "none",
            }}
          >
            {getInitials(userName)}
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                minWidth: "200px",
                padding: "8px",
                zIndex: 100,
                animation: "fadeIn 0.15s ease",
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "10px 12px 12px",
                  borderBottom: "1px solid #F1F5F9",
                  marginBottom: "6px",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                  {userName}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                  {userEmail}
                </p>
              </div>

              {/* Menu items */}
              {[
                { label: "Profile", icon: "👤" },
                { label: "Settings", icon: "⚙️" },
              ].map(({ label, icon }) => (
                <DropdownItem key={label} icon={icon} label={label} onClick={() => setDropdownOpen(false)} />
              ))}

              <div style={{ borderTop: "1px solid #F1F5F9", marginTop: "6px", paddingTop: "6px" }}>
                <DropdownItem icon="🚪" label="Log out" onClick={handleLogout} danger />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function DropdownItem({
  icon, label, onClick, danger = false,
}: {
  icon: string; label: string; onClick: () => void; danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        color: danger ? (hovered ? "#DC2626" : "#EF4444") : (hovered ? "#0F172A" : "#475569"),
        background: hovered ? (danger ? "#FEF2F2" : "#F8FAFC") : "transparent",
        cursor: "pointer",
        transition: "all 0.12s ease",
      }}
    >
      <span>{icon}</span>
      {label}
    </div>
  );
}