import { useState } from "react";
import { signIn } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogin() {
    const { error } = await signIn(email, password);
    if (error) {
      alert(error.message);
      return;
    }
    navigate("/overview");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #0F172A;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow blobs */
        .login-root::before {
          content: '';
          position: absolute;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%);
          top: -120px; left: -120px;
          border-radius: 50%;
          pointer-events: none;
        }
        .login-root::after {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
          bottom: -80px; right: -60px;
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── Sidebar overlay ── */
        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.65);
          backdrop-filter: blur(4px);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Sidebar drawer ── */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 270px; height: 100%;
          background: rgba(30, 27, 75, 0.92);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(124,58,237,0.25);
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          padding: 28px 0 32px;
        }
        .sidebar.open { transform: translateX(0); }

        .sidebar-logo {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #EDE9FE;
          letter-spacing: -0.5px;
          padding: 0 24px 32px;
          border-bottom: 1px solid rgba(124,58,237,0.2);
        }
        .sidebar-logo span { color: #7C3AED; }

        .sidebar-nav {
          list-style: none;
          padding: 24px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-nav li a,
        .sidebar-nav li button {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .sidebar-nav li a:hover,
        .sidebar-nav li button:hover {
          background: rgba(124,58,237,0.15);
          color: #EDE9FE;
        }
        .sidebar-nav li a.active {
          background: rgba(124,58,237,0.22);
          color: #C4B5FD;
        }
        .nav-icon {
          width: 18px; height: 18px;
          opacity: 0.75;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 16px 24px 0;
          border-top: 1px solid rgba(124,58,237,0.15);
          color: #475569;
          font-size: 12px;
        }

        /* ── Sidebar toggle pill ── */
        .sidebar-toggle {
          position: fixed;
          left: 0; top: 50%;
          transform: translateY(-50%);
          z-index: 60;
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          border: none;
          border-radius: 0 24px 24px 0;
          width: 36px; height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 4px 0 24px rgba(124,58,237,0.55);
          transition: width 0.2s, box-shadow 0.2s;
        }
        .sidebar-toggle:hover {
          width: 42px;
          box-shadow: 6px 0 32px rgba(124,58,237,0.7);
        }
        .toggle-icon {
          display: flex; flex-direction: column; gap: 4px;
        }
        .toggle-icon span {
          display: block;
          width: 16px; height: 2px;
          background: #EDE9FE;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        .sidebar-toggle.open .toggle-icon span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .sidebar-toggle.open .toggle-icon span:nth-child(2) {
          opacity: 0;
        }
        .sidebar-toggle.open .toggle-icon span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* ── Login card ── */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 16px;
        }

        .card-inner {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(124,58,237,0.22);
          border-radius: 24px;
          padding: 40px 32px 36px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .card-eyebrow {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #7C3AED;
          margin-bottom: 10px;
        }

        .card-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 32px;
          line-height: 1.1;
          color: #F8FAFC;
          letter-spacing: -1px;
          margin-bottom: 6px;
        }

        .card-sub {
          color: #64748B;
          font-size: 14px;
          margin-bottom: 32px;
        }

        /* ── Fields ── */
        .field {
          margin-bottom: 18px;
        }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #94A3B8;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }
        .field-wrap {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          width: 16px; height: 16px;
          color: #475569;
          pointer-events: none;
        }
        .field input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(100,116,139,0.3);
          border-radius: 12px;
          padding: 13px 14px 13px 40px;
          color: #F1F5F9;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field input::placeholder { color: #334155; }
        .field input:focus {
          border-color: #7C3AED;
          background: rgba(124,58,237,0.07);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.18);
        }

        /* ── CTA button ── */
        .btn-login {
          width: 100%;
          margin-top: 8px;
          padding: 15px;
          background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
          border: none;
          border-radius: 14px;
          color: #F8FAFC;
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(124,58,237,0.42);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          position: relative;
          overflow: hidden;
        }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-login:hover {
          filter: brightness(1.08);
          box-shadow: 0 12px 36px rgba(124,58,237,0.55);
          transform: translateY(-1px);
        }
        .btn-login:active { transform: translateY(0); }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(100,116,139,0.2);
        }
        .divider span {
          color: #334155;
          font-size: 12px;
        }

        /* ── Sign up link ── */
        .signup-row {
          text-align: center;
        }
        .signup-row span {
          color: #475569;
          font-size: 14px;
        }
        .signup-row a {
          color: #A78BFA;
          font-weight: 600;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.15s;
        }
        .signup-row a:hover { color: #EDE9FE; }

        /* Mobile tweaks */
        @media (max-width: 480px) {
          .card-inner { padding: 32px 22px 28px; }
          .card-title { font-size: 28px; }
          .login-card { padding: 12px; }
        }
      `}</style>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar drawer */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          My<span>App</span>
        </div>
        <ul className="sidebar-nav">
          <li>
            <a href="#" className="active">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">v1.0.0 · © 2025</div>
      </aside>

      {/* Toggle pill */}
      <button
        className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <div className="toggle-icon">
          <span /><span /><span />
        </div>
      </button>

      {/* Login card */}
      <main className="login-root">
        <div className="login-card">
          <div className="card-inner">
            <p className="card-eyebrow">Welcome back</p>
            <h1 className="card-title">Sign in</h1>
            <p className="card-sub">Enter your credentials to continue</p>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="field-wrap">
                <svg className="field-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field-wrap">
                <svg className="field-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="btn-login" onClick={handleLogin}>
              Sign in →
            </button>

            <div className="divider"><span>or</span></div>

            <div className="signup-row">
              <span>Don't have an account? </span>
              <Link to="/signup">Create Account</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}