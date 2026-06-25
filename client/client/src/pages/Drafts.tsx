import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
getDrafts,
} from "../services/draftStorage.service";

import {
sendEmail,
} from "../services/email.service";

import { supabase } from "../lib/supabase";

export default function Drafts() {

const [drafts, setDrafts] =
useState<any[]>([]);

const [recipients, setRecipients] =
useState<Record<string, string>>({});

useEffect(() => {
loadDrafts();
}, []);

async function loadDrafts() {

const data =
  await getDrafts();

setDrafts(data);

}

async function handleSendEmail(
draft: any
) {
try {

  const emailList =
    (recipients[draft.id] || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

  if (emailList.length === 0) {
    alert(
      "Please enter at least one recipient email"
    );
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not found");
    return;
  }

  const data =
    await sendEmail({

      userId: user.id,

      company:
        draft.company,

      role:
        draft.role,

      content:
        draft.content,

      recipients:
        emailList

    });

  alert(
    data.message
  );

} catch (err) {

  console.error(err);

  alert(
    "Failed to send email"
  );

}

}

return (
<DashboardLayout>

  <h1>
    Draft Center
  </h1>

  {drafts.map(
    (draft: any) => (

      <div
        key={draft.id}
        style={{
          border:
            "1px solid #ddd",
          padding:
            "15px",
          marginBottom:
            "15px",
          borderRadius:
            "10px",
        }}
      >

        <h3>
          {draft.company}
        </h3>

        <p>
          {draft.role}
        </p>

        <p>
          {draft.draft_type}
        </p>

        <input
          type="text"
          placeholder="student1@gmail.com,student2@gmail.com"
          value={
            recipients[draft.id] || ""
          }
          onChange={(e) =>
            setRecipients({
              ...recipients,
              [draft.id]:
                e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button>
          View
        </button>

        <button
          onClick={() =>
            handleSendEmail(
              draft
            )
          }
          style={{
            marginLeft:
              "10px",
          }}
        >
          Send Email
        </button>

        <button
          style={{
            marginLeft:
              "10px",
          }}
        >
          Delete
        </button>

      </div>

    )
  )}

</DashboardLayout>

);
}