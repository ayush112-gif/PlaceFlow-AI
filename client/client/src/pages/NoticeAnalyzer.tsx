import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { analyzeNotice } from "../services/notice.service";
import { generateDrafts } from "../services/draft.service";
import {
  saveDraft
} from "../services/draftStorage.service";
import AnalysisResultCard from "../components/AnalysisResultCard";

export default function NoticeAnalyzer() {
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<any>(null);
  const [drafts, setDrafts] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  async function handleSaveEmailDraft() {

  await saveDraft({
    

    company:
      result.company,

    role:
      result.role,

    draft_type: "email",

    content:
      drafts.email
  });

  alert(
    "Email Draft Saved"
  );
}

  async function handleAnalyze() {
    try {
      setLoading(true);

      const data = await analyzeNotice(notice);

      console.log("API Response:", data);

      setResult(data.data);

      // New analysis ke baad purane drafts clear
      setDrafts(null);

    } catch (error) {
      console.error(error);
      alert("Failed to analyze notice");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateDrafts() {
    try {
      const data = await generateDrafts(result);

      console.log("Draft Response:", data);
      console.log(result);

      setDrafts(data);

    } catch (error) {
      console.error(error);
      alert("Failed to generate drafts");
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Notice Analyzer
        </h1>

        <textarea
          rows={12}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            resize: "vertical",
          }}
          placeholder="Paste placement notice here..."
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
        />

        <br />
        <br />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Notice"}
        </button>

        {result && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "16px",
                marginTop: "30px",
              }}
            >
              <AnalysisResultCard
                title="Company"
                value={result.company}
              />

              <AnalysisResultCard
                title="Role"
                value={result.role}
              />

              <AnalysisResultCard
                title="CTC"
                value={result.ctc}
              />

              <AnalysisResultCard
                title="Eligibility"
                value={result.eligibility}
              />

              <AnalysisResultCard
                title="Location"
                value={result.location}
              />

              <AnalysisResultCard
                title="Deadline"
                value={result.deadline}
              />
            </div>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <button
                onClick={handleGenerateDrafts}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Generate Drafts
              </button>
            </div>
          </>
        )}

        {drafts && (
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h2>Email Draft</h2>

            <textarea
              rows={10}
              value={drafts.email}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
              }}
            />
                <button
  onClick={
    handleSaveEmailDraft
  }
>
  Save Email Draft
</button>
            <br />
            <br />

            <h2>WhatsApp Draft</h2>

            <textarea
              rows={8}
              value={drafts.whatsapp}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
              }}
            />

            <br />
            <br />

            <h2>Notice Draft</h2>

            <textarea
              rows={10}
              value={drafts.notice}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}