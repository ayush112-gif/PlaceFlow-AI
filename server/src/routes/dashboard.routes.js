const express = require("express");
const router = express.Router();

const supabase = require("../lib/supabase");

router.get("/overview/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Dashboard overview requested for userId:", userId);

    const [
      studentsRes,
      draftsRes,
      emailsRes,
      integrationsRes,
      logsRes
    ] = await Promise.all([
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("integrations")
        .select("provider,status")
        .eq("user_id", userId),

      supabase
        .from("email_logs")
        .select("id,company,recipients_count,status,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)
    ]);

    const responseData = {
      students: studentsRes.count || 0,
      drafts: draftsRes.count || 0,
      emails: emailsRes.count || 0,
      integrations: integrationsRes.data || [],
      recentLogs: logsRes.data || []
    };

    console.log("Dashboard response data:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Dashboard error:", error);
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.status);
    console.error("Error code:", error?.code);

    res.status(500).json({
      error: error?.message || "Unknown error",
      status: error?.status,
      code: error?.code
    });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Dashboard route is working" });
});

module.exports = router;