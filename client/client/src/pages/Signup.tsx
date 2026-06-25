import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth.service";
import { createWorkspace } from "../services/workspace.service";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  async function handleSignup() {
    setError("");
    
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await signUp(email, password);

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await createWorkspace(data.user.id, data.user.email || "");
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container} onMouseMove={handleMouseMove}>
      {/* ANIMATED BACKGROUND */}
      <div style={styles.bgGradient1} />
      <div style={styles.bgGradient2} />
      <div style={styles.bgGradient3} />
      <div style={styles.bgGrid} />

      {/* FLOATING ORBS */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />
      <div style={styles.orb4} />

      {/* ANIMATED SHAPES */}
      <svg style={styles.shapeSvg} viewBox="0 0 1000 1000">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="200" cy="200" r="100" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.2" style={{animation: "rotate 20s linear infinite"}} />
        <circle cx="800" cy="800" r="150" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.15" style={{animation: "rotateReverse 25s linear infinite"}} />
        <circle cx="500" cy="500" r="80" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.1" style={{animation: "rotate 30s linear infinite"}} />
      </svg>

      {/* FLOATING ELEMENTS */}
      <div style={styles.float1}>✉️</div>
      <div style={styles.float2}>💬</div>
      <div style={styles.float3}>📧</div>
      <div style={styles.float4}>🚀</div>
      <div style={styles.float5}>✨</div>
      <div style={styles.float6}>⚡</div>

      {/* MAIN CONTENT */}
      <div style={styles.wrapper}>
        {/* LEFT SIDE */}
        <div style={styles.leftSide}>
          <div style={styles.badgeContainer}>
            <span style={styles.badge}>🎉 Join 10,000+ teams</span>
          </div>

          <h1 style={styles.mainHeading}>
            Supercharge Your
            <br />
            <span style={styles.gradientText}>Placement Game</span>
          </h1>

          <p style={styles.description}>
            AI-powered email campaigns that convert. Track opens, manage templates, and scale your outreach without breaking a sweat.
          </p>

          {/* STATS */}
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>340%</div>
              <div style={styles.statText}>Avg response increase</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>2min</div>
              <div style={styles.statText}>Setup time</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>99%</div>
              <div style={styles.statText}>Uptime guarantee</div>
            </div>
          </div>

          {/* FEATURES */}
          <div style={styles.featureGrid}>
            <div style={styles.featureBadge}>
              <span style={styles.featureIcon}>🤖</span>
              <span>AI Assistant</span>
            </div>
            <div style={styles.featureBadge}>
              <span style={styles.featureIcon}>📊</span>
              <span>Live Analytics</span>
            </div>
            <div style={styles.featureBadge}>
              <span style={styles.featureIcon}>🔄</span>
              <span>Auto Templates</span>
            </div>
            <div style={styles.featureBadge}>
              <span style={styles.featureIcon}>🎯</span>
              <span>Smart Scheduling</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div style={styles.rightSide}>
          <div style={styles.formWrapper}>
            {/* FORM GLOW EFFECT */}
            <div style={{...styles.glowEffect, left: `${mousePos.x}px`, top: `${mousePos.y}px`}} />

            <div style={styles.formContent}>
              {/* HEADER */}
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>Create Account</h2>
                <p style={styles.formSubtitle}>Get started in 30 seconds</p>
              </div>

              {/* ALERTS */}
              {error && (
                <div style={styles.alertError}>
                  <span style={styles.alertIcon}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div style={styles.alertSuccess}>
                  <span style={styles.alertIcon}>✅</span>
                  <span>Welcome aboard! Redirecting...</span>
                </div>
              )}

              {/* EMAIL */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                  <span style={styles.inputIcon}>✉️</span>
                </div>
              </div>

              {/* PASSWORD */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.toggleBtn}
                    type="button"
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                  <span style={styles.inputIcon}>🔐</span>
                </div>
              </div>

              {/* CHECKBOX */}
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span>I agree to Terms & Privacy</span>
              </label>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleSignup}
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                <span style={{display: "flex", alignItems: "center", gap: "8px", justifyContent: "center"}}>
                  {loading ? (
                    <>
                      <span style={styles.spinner} />
                      Creating Account
                    </>
                  ) : (
                    <>
                      Get Started Free
                      <span style={{fontSize: "16px"}}>→</span>
                    </>
                  )}
                </span>
              </button>

              {/* LOGIN LINK */}
              <p style={styles.loginPrompt}>
                Already have an account?{" "}
                <Link to="/" style={styles.loginLink}>
                  Sign in
                </Link>
              </p>

              {/* DIVIDER */}
              <div style={styles.divider} />

              {/* SOCIAL */}
              <div style={styles.socialContainer}>
                <button style={styles.socialButton} type="button">
                  <span style={{fontSize: "18px"}}>🔵</span> Google
                </button>
                <button style={styles.socialButton} type="button">
                  <span style={{fontSize: "18px"}}>⬛</span> GitHub
                </button>
              </div>

              {/* FOOTER */}
              <p style={styles.formFooter}>
                🔒 Your data is end-to-end encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bgGradient1: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 50%)",
    animation: "float 15s ease-in-out infinite",
    zIndex: 0,
  },
  bgGradient2: {
    position: "absolute",
    top: "50%",
    right: "-50%",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
    animation: "float2 20s ease-in-out infinite",
    zIndex: 0,
  },
  bgGradient3: {
    position: "absolute",
    bottom: "-50%",
    left: "20%",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
    animation: "float 25s ease-in-out infinite reverse",
    zIndex: 0,
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
    zIndex: 1,
  },
  orb1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "-100px",
    left: "-100px",
    filter: "blur(40px)",
    animation: "float 20s ease-in-out infinite",
    zIndex: 1,
  },
  orb2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "-200px",
    right: "-150px",
    filter: "blur(50px)",
    animation: "float2 25s ease-in-out infinite",
    zIndex: 1,
  },
  orb3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "50%",
    left: "10%",
    filter: "blur(35px)",
    animation: "float 30s ease-in-out infinite reverse",
    zIndex: 1,
  },
  orb4: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "10%",
    right: "5%",
    filter: "blur(45px)",
    animation: "float 22s ease-in-out infinite",
    zIndex: 1,
  },
  shapeSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    opacity: 0.3,
  },
  float1: {position: "absolute", fontSize: "60px", top: "10%", left: "8%", animation: "floatIcon 4s ease-in-out infinite", zIndex: 3},
  float2: {position: "absolute", fontSize: "50px", top: "25%", right: "10%", animation: "floatIcon2 5s ease-in-out infinite", zIndex: 3},
  float3: {position: "absolute", fontSize: "45px", bottom: "20%", left: "12%", animation: "floatIcon 6s ease-in-out infinite reverse", zIndex: 3},
  float4: {position: "absolute", fontSize: "55px", top: "50%", right: "5%", animation: "floatIcon2 4.5s ease-in-out infinite reverse", zIndex: 3},
  float5: {position: "absolute", fontSize: "40px", bottom: "30%", right: "15%", animation: "floatIcon 7s ease-in-out infinite", zIndex: 3},
  float6: {position: "absolute", fontSize: "50px", top: "35%", left: "50%", animation: "floatIcon2 5.5s ease-in-out infinite", zIndex: 3},

  wrapper: {
    maxWidth: "1450px",
    width: "100%",
    padding: "40px 60px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "80px",
    alignItems: "center",
    zIndex: 10,
    position: "relative",
  },
  leftSide: {
    paddingRight: "40px",
  },
  badgeContainer: {
    marginBottom: "24px",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  mainHeading: {
    fontSize: "64px",
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: "24px",
    color: "#fff",
  },
  gradientText: {
    background: "linear-gradient(135deg, #6366f1, #ec4899, #10b981)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontSize: "18px",
    color: "#b4b9c8",
    lineHeight: 1.8,
    marginBottom: "48px",
    maxWidth: "500px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "48px",
  },
  statBox: {
    padding: "20px",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: 900,
    color: "#6366f1",
    marginBottom: "4px",
  },
  statText: {
    fontSize: "12px",
    color: "#b4b9c8",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  featureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#10b981",
  },
  featureIcon: {
    fontSize: "16px",
  },

  rightSide: {
    display: "flex",
    justifyContent: "center",
  },
  formWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "450px",
  },
  glowEffect: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)",
    borderRadius: "50%",
    filter: "blur(40px)",
    pointerEvents: "none",
    transition: "left 0.1s, top 0.1s",
    zIndex: -1,
  },
  formContent: {
    position: "relative",
    background: "rgba(12, 12, 20, 0.95)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "24px",
    padding: "56px 40px",
    backdropFilter: "blur(50px)",
    boxShadow: "0 25px 100px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  formHeader: {
    marginBottom: "32px",
    textAlign: "center",
  },
  formTitle: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "8px",
    background: "linear-gradient(135deg, #fff, #b4b9c8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#7a7f98",
  },
  alertError: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  alertSuccess: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.4)",
    color: "#6ee7b7",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  alertIcon: {
    fontSize: "16px",
  },
  inputGroup: {
    marginBottom: "24px",
  },
  inputLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: "#b4b9c8",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "linear-gradient(135deg, rgba(37, 37, 65, 0.5), rgba(37, 37, 65, 0.3))",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  inputIcon: {
    position: "absolute",
    right: "14px",
    fontSize: "16px",
    pointerEvents: "none",
  },
  toggleBtn: {
    position: "absolute",
    right: "14px",
    background: "transparent",
    border: "none",
    color: "#b4b9c8",
    cursor: "pointer",
    fontSize: "16px",
    padding: 0,
    zIndex: 2,
    transition: "all 0.2s ease",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#b4b9c8",
    marginBottom: "28px",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#6366f1",
  },
  submitButton: {
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #6366f1, #7c3aed, #ec4899)",
    backgroundSize: "200% 200%",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
    animation: "gradientShift 3s ease infinite",
  },
  spinner: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  loginPrompt: {
    textAlign: "center",
    fontSize: "12px",
    color: "#7a7f98",
    marginBottom: "24px",
    margin: 0,
  },
  loginLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)",
    marginBottom: "20px",
  },
  socialContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },
  socialButton: {
    padding: "12px 16px",
    background: "rgba(37, 37, 65, 0.6)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "12px",
    color: "#b4b9c8",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  formFooter: {
    textAlign: "center",
    fontSize: "11px",
    color: "#7a7f98",
    margin: 0,
  },
};