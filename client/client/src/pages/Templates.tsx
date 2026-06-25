
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { supabase } from "../lib/supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEFAULT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
body{
  font-family: Arial, sans-serif;
  background:#f4f6f9;
  padding:20px;
}

.container{
  max-width:700px;
  margin:auto;
  background:#ffffff;
  padding:30px;
  border-radius:12px;
  box-shadow:0 2px 10px rgba(0,0,0,0.08);
}

.header{
  background:#2563eb;
  color:white;
  padding:20px;
  border-radius:8px;
  text-align:center;
}

.content{
  margin-top:20px;
  line-height:1.7;
}

.footer{
  margin-top:30px;
  border-top:1px solid #e5e7eb;
  padding-top:20px;
  color:#6b7280;
}
</style>

</head>

<body>

<div class="container">

<div class="header">
<h2>{{company_name}} Placement Drive</h2>
</div>

<div class="content">

<p>Dear Students,</p>

{{content}}

</div>

<div class="footer">
<p>Regards,</p>
<p><strong>Placement Cell</strong></p>
</div>

</div>

</body>
</html>
`;

export default function Templates() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const [html, setHtml] = useState(DEFAULT_TEMPLATE);

  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    loadTemplate();
  }, []);

  useEffect(() => {
    updatePreview(html);
  }, [html]);

  function updatePreview(templateHtml: string) {
    const rendered = templateHtml
      .replace(/{{company_name}}/g, "Microsoft")
      .replace(/{{role}}/g, "Software Development Engineer")
      .replace(/{{ctc}}/g, "18 LPA")
      .replace(/{{location}}/g, "Noida")
      .replace(/{{deadline}}/g, "30 June 2026")
      .replace(
        /{{content}}/g,
        `
        <p>
          Microsoft India is inviting applications for the role of
          Software Development Engineer.
        </p>

        <ul>
          <li><strong>Role:</strong> Software Development Engineer</li>
          <li><strong>CTC:</strong> 18 LPA</li>
          <li><strong>Location:</strong> Noida</li>
          <li><strong>Deadline:</strong> 30 June 2026</li>
        </ul>

        <p>
          Interested students are requested to apply before the deadline.
        </p>
        `
      );

    setPreviewHtml(rendered);
  }

  async function loadTemplate() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch(
        `${API_BASE}/api/templates/${user.id}`
      );

      if (!res.ok) {
        setHtml(DEFAULT_TEMPLATE);
        return;
      }

      const json = await res.json();

      if (json?.data) {
        setName(json.data.name || "");
        setSubject(json.data.subject || "");

        const templateHtml =
          json.data.html || DEFAULT_TEMPLATE;

        setHtml(templateHtml);
      }
    } catch (err) {
      console.error(err);
      setHtml(DEFAULT_TEMPLATE);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not found");
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/templates/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            name,
            subject,
            html,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || "Failed to save template"
        );
      }

      alert("Template Saved Successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Email Template Builder
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* LEFT */}

            <div>
              <div style={{ marginBottom: "16px" }}>
                <label>Template Name</label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>Subject</label>

                <input
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>HTML Template</label>

                <textarea
                  value={html}
                  onChange={(e) =>
                    setHtml(e.target.value)
                  }
                  rows={30}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              <button
                onClick={handleSave}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Save Template
              </button>

              <div
                style={{
                  marginTop: "20px",
                  background: "#f8fafc",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <h3>Available Variables</h3>

                <ul>
                  <li>{"{{company_name}}"}</li>
                  <li>{"{{content}}"}</li>
                  <li>{"{{role}}"}</li>
                  <li>{"{{ctc}}"}</li>
                  <li>{"{{location}}"}</li>
                  <li>{"{{deadline}}"}</li>
                </ul>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <h2>Live Preview</h2>

              <iframe
                title="email-preview"
                srcDoc={previewHtml}
                style={{
                  width: "100%",
                  height: "900px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "#fff",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

