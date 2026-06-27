import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { supabase } from "../lib/supabase";

import {
  getStudents,
  addStudent
} from "../services/student.service";

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#0F172A",
    padding: "32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: "28px",
    color: "#0F172A",
  },

  // --- Form Card ---
  formCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "28px 32px",
    marginBottom: "36px",
    boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#64748B",
  },
  input: {
    padding: "9px 12px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0F172A",
    background: "#F8FAFC",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#6366F1",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "10px 22px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },

  // --- Table Section ---
  tableSection: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
  },
  tableHeader: {
    padding: "18px 24px 14px",
    borderBottom: "1px solid #E2E8F0",
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0F172A",
    margin: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  thead: {
    background: "#F8FAFC",
  },
  th: {
    padding: "11px 16px",
    textAlign: "left" as const,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#64748B",
    borderBottom: "1px solid #E2E8F0",
  },
  tdBase: {
    padding: "13px 16px",
    fontSize: "14px",
    color: "#1E293B",
    borderBottom: "1px solid #F1F5F9",
  },
  tdMono: {
    padding: "13px 16px",
    fontSize: "13px",
    fontFamily: "'Fira Mono', 'Courier New', monospace",
    color: "#6366F1",
    fontWeight: 600,
    borderBottom: "1px solid #F1F5F9",
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: 600,
    background: "#EEF2FF",
    color: "#4338CA",
  },
  emptyRow: {
    textAlign: "center" as const,
    color: "#94A3B8",
    padding: "40px 16px",
    fontSize: "14px",
  },
};

export default function Students() {

  const [students, setStudents] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      roll_no: "",
      branch: "",
      section: "",
      year: ""
    });

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const data =
      await getStudents(user.id);

    setStudents(data);
  }

  async function handleAddStudent() {

    try {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not found");
        return;
      }

      await addStudent({

        userId: user.id,

        name: form.name,

        email: form.email,

        roll_no: form.roll_no,

        branch: form.branch,

        section: form.section,

        year: Number(form.year)

      });

      alert("Student Added");

      setForm({
        name: "",
        email: "",
        roll_no: "",
        branch: "",
        section: "",
        year: ""
      });

      loadStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to add student"
      );

    }
  }

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "name",    label: "Full Name",    placeholder: "e.g. Riya Sharma"    },
    { key: "email",   label: "Email",        placeholder: "e.g. riya@college.edu" },
    { key: "roll_no", label: "Roll No",      placeholder: "e.g. 2024CS042"      },
    { key: "branch",  label: "Branch",       placeholder: "e.g. Computer Science" },
    { key: "section", label: "Section",      placeholder: "e.g. A"              },
    { key: "year",    label: "Year",         placeholder: "e.g. 2"              },
  ];

  return (

    <DashboardLayout>

      <div style={styles.pageWrapper}>

        <h1 style={styles.pageTitle}>Students</h1>

        {/* ── Add Student Form ── */}
        <div style={styles.formCard}>

          <h3 style={styles.formTitle}>Add Student</h3>

          <div style={styles.formGrid}>
            {fields.map(({ key, label, placeholder }) => (
              <div key={key} style={styles.fieldWrapper}>
                <label style={styles.label}>{label}</label>
                <input
                  style={styles.input}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366F1";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
                    e.target.style.background = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#CBD5E1";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#F8FAFC";
                  }}
                />
              </div>
            ))}
          </div>

          <button
            style={styles.addButton}
            onClick={handleAddStudent}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#4F46E5")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#6366F1")
            }
          >
            + Add Student
          </button>

        </div>

        {/* ── Student List ── */}
        <div style={styles.tableSection}>

          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>
              Student List
              <span style={{ ...styles.badge, marginLeft: "10px", fontSize: "12px" }}>
                {students.length}
              </span>
            </h3>
          </div>

          <table style={styles.table}>

            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Roll No</th>
                <th style={styles.th}>Branch</th>
                <th style={styles.th}>Section</th>
                <th style={styles.th}>Year</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyRow}>
                    No students added yet. Use the form above to get started.
                  </td>
                </tr>
              ) : (
                students.map((student: any, i: number) => (
                  <tr
                    key={student.id}
                    style={{
                      background: i % 2 === 0 ? "#FFFFFF" : "#FAFBFF",
                    }}
                  >
                    <td style={{ ...styles.tdBase, fontWeight: 500 }}>
                      {student.name}
                    </td>
                    <td style={{ ...styles.tdBase, color: "#475569" }}>
                      {student.email}
                    </td>
                    <td style={styles.tdMono}>
                      {student.roll_no}
                    </td>
                    <td style={styles.tdBase}>
                      {student.branch}
                    </td>
                    <td style={styles.tdBase}>
                      <span style={styles.badge}>{student.section}</span>
                    </td>
                    <td style={styles.tdBase}>
                      Year {student.year}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
}