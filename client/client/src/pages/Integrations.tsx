import { useEffect, useState } from "react";
import {
  
  validateIntegration,
  getIntegrations,
} from "../services/integration.service";
import DashboardLayout from "../layouts/DashboardLayout";
import { supabase } from "../lib/supabase";


export default function Integrations() {
  const [brevoSenderName, setBrevoSenderName] = useState("");
const [brevoSenderEmail, setBrevoSenderEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [statusMessages, setStatusMessages] = useState<Record<string, string>>({});
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({});
  const [providerLoading, setProviderLoading] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string>("");

  // AI Providers
  const [openrouter, setOpenrouter] = useState("");
  const [gemini, setGemini] = useState("");

  // Email Providers
  const [brevoApiKey, setBrevoApiKey] = useState("");

  // SMTP
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    initializeUser();
  }, []);

  async function initializeUser() {
  try {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "User not authenticated"
      );
    }

    setUserId(user.id);

    await loadIntegrations();

  } catch (err) {
    console.error(
      "Failed to initialize user:",
      err
    );
  } finally {
    setLoading(false);
  }
}

  async function loadIntegrations() {
    try {
      const data = await getIntegrations();
      setIntegrations(data || []);

      data.forEach((item: any) => {
        switch (item.provider) {
          case "openrouter":
            setOpenrouter(item.api_key || "");
            break;
          case "gemini":
            setGemini(item.api_key || "");
            break;
          case "brevo":
            setBrevoApiKey(item.api_key || "");
            break;
          case "smtp":
            setHost(item.host || "");
            setPort(item.port ? String(item.port) : "");
            setUsername(item.username || "");
            setPassword(item.password || "");
            setSenderEmail(item.sender_email || "");
            setSenderName(item.sender_name || "");
            break;
          default:
            break;
        }
      });
    } catch (err) {
      console.error("Failed to load integrations:", err);
    }
  }

  const normalizeStatus = (status: any) => status === true || status === "true";

  function getIntegration(provider: string) {
    return integrations.find((item: any) => item.provider === provider);
  }

  function getProviderStatus(provider: string) {
    const integration = getIntegration(provider);
    return normalizeStatus(integration?.status) ? "Connected" : "Disconnected";
  }

  function getProviderStatusColor(provider: string) {
    return getProviderStatus(provider) === "Connected" ? "#10b981" : "#ef4444";
  }

  /**
   * Validate and save integration with user feedback
   */
  async function handleValidateAndSave(
    provider: string,
    credentials: any,
    onSuccess?: () => void
  ) {
    try {
      setProviderLoading((prev) => ({ ...prev, [provider]: true }));
      setStatusMessages((prev) => ({ ...prev, [provider]: "Validating..." }));

      // Call validation endpoint
      const result = await validateIntegration({
        provider,
        ...credentials,
      });

      // Update status messages
      setStatusMessages((prev) => ({
        ...prev,
        [provider]: result.message || "Validation completed",
      }));

      // Set validation status
      setValidationStatus((prev) => ({
        ...prev,
        [provider]: result.status,
      }));

      // Reload integrations to update display
      await loadIntegrations();

      if (result.status) {
        onSuccess?.();
      }
    } catch (err: any) {
      console.error(`Failed to validate ${provider}:`, err);
      setStatusMessages((prev) => ({
        ...prev,
        [provider]: err.message || "Validation failed",
      }));
      setValidationStatus((prev) => ({ ...prev, [provider]: false }));
    } finally {
      setProviderLoading((prev) => ({ ...prev, [provider]: false }));
    }
  }

  // OpenRouter handlers
  async function handleValidateOpenRouter() {
    if (!openrouter.trim()) {
      setStatusMessages((prev) => ({
        ...prev,
        openrouter: "Please enter an API key",
      }));
      return;
    }
    await handleValidateAndSave("openrouter", { api_key: openrouter });
  }

  // Gemini handlers
  async function handleValidateGemini() {
    if (!gemini.trim()) {
      setStatusMessages((prev) => ({
        ...prev,
        gemini: "Please enter an API key",
      }));
      return;
    }
    await handleValidateAndSave("gemini", { api_key: gemini });
  }

  // Brevo handlers
  async function handleValidateBrevo() {
  if (!brevoApiKey.trim()) {
    setStatusMessages((prev) => ({
      ...prev,
      brevo: "Please enter an API key",
    }));
    return;
  }

  await handleValidateAndSave("brevo", {
    api_key: brevoApiKey,
    sender_name: brevoSenderName,
    sender_email: brevoSenderEmail,
  });
}

  // SMTP handlers
  async function handleValidateSMTP() {
    if (!host.trim() || !port.trim() || !username.trim() || !password.trim()) {
      setStatusMessages((prev) => ({
        ...prev,
        smtp: "Please fill in all required fields",
      }));
      return;
    }
    await handleValidateAndSave("smtp", {
      host,
      port: Number(port),
      username,
      password,
      sender_email: senderEmail,
      sender_name: senderName,
    });
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Loading integrations...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        .integration-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .integration-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 12px;
          font-family: monospace;
        }
        .integration-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .integration-button {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          margin-right: 10px;
          transition: all 0.2s ease;
        }
        .integration-button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .integration-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 16px;
        }
        .status-badge.connected {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #d1fae5;
        }
        .status-badge.disconnected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .status-message {
          font-size: 13px;
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          background: #f3f4f6;
          color: #374151;
        }
        .status-message.success {
          background: #ecfdf5;
          color: #065f46;
        }
        .status-message.error {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>

      <div style={{ padding: "20px", maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>
          Integrations
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Connect your tools and services to enhance platform capabilities
        </p>

        {/* AI PROVIDERS */}
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "16px" }}>
          🤖 AI Providers
        </h2>

        {/* OpenRouter */}
        <div className="integration-card">
          <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
            OpenRouter
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: "13px" }}>
            Access multiple AI models through a single API
          </p>

          <input
            type="password"
            value={openrouter}
            onChange={(e) => setOpenrouter(e.target.value)}
            placeholder="Enter OpenRouter API Key"
            className="integration-input"
          />

          <button
            onClick={handleValidateOpenRouter}
            disabled={providerLoading.openrouter}
            className="integration-button"
          >
            {providerLoading.openrouter ? "Validating..." : "Validate & Save"}
          </button>

          <div
            className={`status-badge ${
              getProviderStatus("openrouter") === "Connected"
                ? "connected"
                : "disconnected"
            }`}
          >
            {getProviderStatus("openrouter") === "Connected" ? "✓ Connected" : "✕ Disconnected"}
          </div>

          {statusMessages.openrouter && (
            <div
              className={`status-message ${
                validationStatus.openrouter ? "success" : "error"
              }`}
            >
              {statusMessages.openrouter}
            </div>
          )}
        </div>

        {/* Gemini */}
        <div className="integration-card">
          <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
            Google Gemini
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: "13px" }}>
            Advanced AI models for text and image processing
          </p>

          <input
            type="password"
            value={gemini}
            onChange={(e) => setGemini(e.target.value)}
            placeholder="Enter Gemini API Key"
            className="integration-input"
          />

          <button
            onClick={handleValidateGemini}
            disabled={providerLoading.gemini}
            className="integration-button"
          >
            {providerLoading.gemini ? "Validating..." : "Validate & Save"}
          </button>

          <div
            className={`status-badge ${
              getProviderStatus("gemini") === "Connected"
                ? "connected"
                : "disconnected"
            }`}
          >
            {getProviderStatus("gemini") === "Connected" ? "✓ Connected" : "✕ Disconnected"}
          </div>

          {statusMessages.gemini && (
            <div
              className={`status-message ${
                validationStatus.gemini ? "success" : "error"
              }`}
            >
              {statusMessages.gemini}
            </div>
          )}
        </div>

        {/* EMAIL PROVIDERS */}
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "16px" }}>
          📧 Email Providers
        </h2>

        {/* Brevo */}
        <div className="integration-card">
          <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
            Brevo (formerly Sendinblue)
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: "13px" }}>
            Email marketing and transactional email service
          </p>

          <input
            type="password"
            value={brevoApiKey}
            onChange={(e) => setBrevoApiKey(e.target.value)}
            placeholder="Enter Brevo API Key"
            className="integration-input"
          />
          <input
  value={brevoSenderName}
  onChange={(e) => setBrevoSenderName(e.target.value)}
  placeholder="Sender Name"
/>

<input
  value={brevoSenderEmail}
  onChange={(e) => setBrevoSenderEmail(e.target.value)}
  placeholder="Verified Sender Email"
/>

          <button
            onClick={handleValidateBrevo}
            disabled={providerLoading.brevo}
            className="integration-button"
          >
            {providerLoading.brevo ? "Validating..." : "Validate & Save"}
          </button>

          <div
            className={`status-badge ${
              getProviderStatus("brevo") === "Connected"
                ? "connected"
                : "disconnected"
            }`}
          >
            {getProviderStatus("brevo") === "Connected" ? "✓ Connected" : "✕ Disconnected"}
          </div>

          {statusMessages.brevo && (
            <div
              className={`status-message ${
                validationStatus.brevo ? "success" : "error"
              }`}
            >
              {statusMessages.brevo}
            </div>
          )}
        </div>

        {/* SMTP */}
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "16px" }}>
          📮 SMTP Settings
        </h2>

        <div className="integration-card">
          <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
            SMTP Server Configuration
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: "13px" }}>
            Connect your custom SMTP server for sending emails
          </p>

          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="SMTP Host (e.g., smtp.gmail.com)"
            className="integration-input"
          />

          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="SMTP Port (e.g., 587 or 465)"
            className="integration-input"
          />

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="SMTP Username"
            className="integration-input"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="SMTP Password"
            className="integration-input"
          />

          <input
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Sender Email Address"
            className="integration-input"
          />

          <input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Sender Name"
            className="integration-input"
          />

          <button
            onClick={handleValidateSMTP}
            disabled={providerLoading.smtp}
            className="integration-button"
          >
            {providerLoading.smtp ? "Validating..." : "Validate & Save"}
          </button>

          <div
            className={`status-badge ${
              getProviderStatus("smtp") === "Connected"
                ? "connected"
                : "disconnected"
            }`}
          >
            {getProviderStatus("smtp") === "Connected" ? "✓ Connected" : "✕ Disconnected"}
          </div>

          {statusMessages.smtp && (
            <div
              className={`status-message ${
                validationStatus.smtp ? "success" : "error"
              }`}
            >
              {statusMessages.smtp}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

    