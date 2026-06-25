const express = require("express");
const OpenAI = require("openai");
const supabase = require("../lib/supabase");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { notice, userId } = req.body;
    const { data: integration } =
  await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "openrouter")
    .single();

if (!integration) {
  return res.status(400).json({
    success: false,
    message:
      "Please connect OpenRouter API key first",
  });
}

    const client = new OpenAI({
  apiKey: integration.api_key,
  baseURL: "https://openrouter.ai/api/v1",
});

    const completion =
      await client.chat.completions.create({
        model: "meta-llama/llama-4-scout",
        max_tokens: 500,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `
Extract:

Company
Role
CTC
Eligibility
Deadline
Location

Return ONLY valid JSON.

Example:
{
  "company":"",
  "role":"",
  "ctc":"",
  "eligibility":"",
  "deadline":"",
  "location":""
}

Do not write explanations.
Do not write markdown.
Only return raw JSON.
`,
          },
          {
            role: "user",
            content: notice,
          },
        ],
      });

    const result =
      completion.choices[0].message.content;

    console.log("RAW AI RESPONSE:");
    console.log(result);

    try {
      const cleaned = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      const formatted = {
        company:
          parsed.Company ||
          parsed.company ||
          "",

        role:
          parsed.Role ||
          parsed.role ||
          "",

        ctc:
          parsed.CTC ||
          parsed.ctc ||
          "",

        eligibility:
          parsed.Eligibility ||
          parsed.eligibility ||
          "",

        deadline:
          parsed.Deadline ||
          parsed.deadline ||
          "",

        location:
          parsed.Location ||
          parsed.location ||
          "",
      };

      return res.json({
        success: true,
        data: formatted,
      });
    } catch (err) {
      console.log(
        "INVALID AI RESPONSE:"
      );

      console.log(result);

      return res.status(500).json({
        success: false,
        message:
          "AI did not return valid JSON",
        raw: result,
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
