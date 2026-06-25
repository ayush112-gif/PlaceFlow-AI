
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const supabase = require("../lib/supabase");
const { sendBrevo } = require("../services/brevo.service");

function normalizeStatus(status) {
  return status === true || status === "true";
}

router.post("/send", async (req, res) => {
  try {
    const {
      userId,
      company,
      role,
      content,
      recipients,
      subject: overrideSubject,
    } = req.body;

    if (
      !userId ||
      !recipients ||
      !Array.isArray(recipients) ||
      recipients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ==========================
    // FETCH USER TEMPLATE
    // ==========================
    const { data: templateData, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (templateError) {
      console.error("Template fetch error:", templateError);
    }

    const template = templateData || null;

    // ==========================
    // BUILD FINAL HTML
    // ==========================
    const baseHtml =
      template?.html_content ||
      `
      <html>
        <body>
          <h2>{{company_name}}</h2>
          {{content}}
        </body>
      </html>
      `;

    const finalHtml = baseHtml
      .replace(/{{company_name}}/g, company || "")
      .replace(/{{role}}/g, role || "")
      .replace(/{{ctc}}/g, "")
      .replace(/{{location}}/g, "")
      .replace(/{{deadline}}/g, "")
      .replace(
        /{{content}}/g,
        (content || "").replace(/\n/g, "<br>")
      );

    const finalSubject =
      overrideSubject ||
      template?.subject ||
      `${company} Recruitment Drive`;

    console.log("========== EMAIL DEBUG ==========");
    console.log("TEMPLATE FOUND:", !!template);
    console.log("TEMPLATE NAME:", template?.template_name);
    console.log("SUBJECT:", finalSubject);
    console.log("================================");

    // ==========================
    // SMTP
    // ==========================
    const { data: smtpConfig } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "smtp")
      .maybeSingle();

   
if (smtpConfig && normalizeStatus(smtpConfig.status)) {
  try {
    console.log("Trying SMTP...");

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: Number(smtpConfig.port),
      secure: Number(smtpConfig.port) === 465,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    });

    const result = await transporter.sendMail({
      from: `"${smtpConfig.sender_name}" <${smtpConfig.sender_email}>`,
      to: recipients.join(","),
      subject: finalSubject,
      html: finalHtml,
    });

    await supabase.from("email_logs").insert({
      user_id: userId,
      company,
      role,
      recipients_count: recipients.length,
      status: "success",
      provider: "smtp",
    });

    return res.json({
      success: true,
      provider: "smtp",
      messageId: result.messageId,
      message: "Email sent via SMTP",
    });

  } catch (smtpError) {
    console.error("SMTP FAILED:", smtpError.message);

    await supabase.from("email_logs").insert({
      user_id: userId,
      company,
      role,
      recipients_count: recipients.length,
      status: "smtp_failed",
      provider: "smtp",
    });

    // SMTP fail hua
    // Ab code automatically Brevo block tak jayega
  }
}



    // ==========================
    // BREVO
    // ==========================
    const { data: brevoConfig } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "brevo")
      .maybeSingle();

    if (brevoConfig && normalizeStatus(brevoConfig.status)) {
      const brevoResult = await sendBrevo(
        brevoConfig,
        recipients,
        finalSubject,
        finalHtml
      );

      await supabase.from("email_logs").insert({
        user_id: userId,
        company,
        role,
        recipients_count: recipients.length,
        status: "success",
        provider: "brevo",
      });

      return res.json({
        success: true,
        provider: "brevo",
        data: brevoResult,
        message: "Email sent via Brevo",
      });
    }

    return res.status(400).json({
      success: false,
      message: "No active email provider configured",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    await supabase.from("email_logs").insert({
      user_id: req.body.userId || null,
      company: req.body.company || null,
      role: req.body.role || null,
      recipients_count: Array.isArray(req.body.recipients)
        ? req.body.recipients.length
        : 0,
      status: "failed",
      provider: null,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/logs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

