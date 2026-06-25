import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { supabase } from "../lib/supabase";

import {
  getStudents,
  addStudent
} from "../services/student.service";

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

  return (

    <DashboardLayout>

      <h1>
        Students
      </h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >

        <h3>
          Add Student
        </h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Roll No"
          value={form.roll_no}
          onChange={(e) =>
            setForm({
              ...form,
              roll_no: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Branch"
          value={form.branch}
          onChange={(e) =>
            setForm({
              ...form,
              branch: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Section"
          value={form.section}
          onChange={(e) =>
            setForm({
              ...form,
              section: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) =>
            setForm({
              ...form,
              year: e.target.value
            })
          }
        />

        <br />
        <br />

        <button
          onClick={handleAddStudent}
        >
          Add Student
        </button>

      </div>

      <h3>
        Student List
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Roll No</th>

            <th>Branch</th>

            <th>Section</th>

            <th>Year</th>

          </tr>

        </thead>

        <tbody>

          {students.map(
            (student: any) => (

              <tr
                key={student.id}
              >

                <td>
                  {student.name}
                </td>

                <td>
                  {student.email}
                </td>

                <td>
                  {student.roll_no}
                </td>

                <td>
                  {student.branch}
                </td>

                <td>
                  {student.section}
                </td>

                <td>
                  {student.year}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </DashboardLayout>

  );
}