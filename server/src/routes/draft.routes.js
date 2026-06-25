const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const {
      company,
      role,
      ctc,
      eligibility,
      location,
      deadline,
      userId,
    } = req.body;

    const { data: integration, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "openrouter")
      .single();

    if (error || !integration?.api_key) {
      return res.status(400).json({
        success: false,
        message: "Please connect OpenRouter API first",
      });
    }

    const email = `
Subject: ${company} Recruitment Drive | ${role}

Dear Students,

Greetings from the Placement Cell.

We are pleased to inform you that ${company} is hiring for the position of ${role}.

Company Details:
• Company: ${company}
• Role: ${role}
• Package: ${ctc}
• Location: ${location}

Eligibility Criteria:
• ${eligibility}

Important Information:
• Students are advised to carefully review all eligibility criteria before applying.
• Ensure that your resume is updated and accurate.
• Applications submitted after the deadline may not be considered.

Application Deadline:
${deadline}

Interested and eligible students are encouraged to apply before the deadline.

For any queries, please contact the Placement Cell.

Best Regards,
Placement Cell
`;

    const whatsapp = `
📢 *${company} Hiring Alert*

💼 Role: ${role}
💰 Package: ${ctc}
📍 Location: ${location}

🎓 Eligibility:
${eligibility}

⏳ Deadline:
${deadline}

Interested and eligible students should apply before the deadline.

- Placement Cell
`;

    const notice = `
OFFICIAL PLACEMENT NOTICE

Company: ${company}

Role:
${role}

Compensation:
${ctc}

Location:
${location}

Eligibility:
${eligibility}

Application Deadline:
${deadline}

Instructions:

1. Read all eligibility criteria carefully.
2. Ensure your resume is updated.
3. Apply before the deadline.
4. Late applications may not be considered.

For further information contact the Placement Cell.

Placement Cell
`;

    return res.json({
      success: true,
      email,
      whatsapp,
      notice,
    });

  } catch (error) {
    console.error("DRAFT GENERATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;