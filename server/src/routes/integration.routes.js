const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabase");
const {
  validateSMTP,
  validateOpenRouter,
  validateGemini,
  validateBrevo,
} = require("../services/validation.service");

/**
 * POST /api/integrations/validate
 * Validates integration credentials and saves the result
 * Request body: { userId, provider, config }
 * Response: { success, status, message, data }
 */
router.post("/validate", async (req, res) => {
  try {
    const { userId, provider, config } = req.body;

    // Validate required parameters
    if (!userId || !provider || !config) {
      return res.status(400).json({
        success: false,
        status: false,
        message: "Missing required parameters: userId, provider, config",
      });
    }

    let validationResult;

    // Route to appropriate validator based on provider
    switch (provider.toLowerCase()) {
      case "smtp":
        validationResult = await validateSMTP(config);
        break;
      case "openrouter":
        validationResult = await validateOpenRouter(config.api_key);
        break;
      case "gemini":
        validationResult = await validateGemini(config.api_key);
        break;
      case "brevo":
        validationResult = await validateBrevo(config.api_key);
        break;
      default:
        return res.status(400).json({
          success: false,
          status: false,
          message: `Unsupported provider: ${provider}`,
        });
    }

    // Build update payload with validation result
    const updatePayload = {
      user_id: userId,
      provider: provider.toLowerCase(),
      status: validationResult.status,
      updated_at: new Date().toISOString(),
    };

    // Add provider-specific fields if config exists
    if (config && typeof config === "object") {
      Object.keys(config).forEach((key) => {
        if (key !== "api_key" && config[key]) {
          updatePayload[key] = config[key];
        }
      });

      // Store sensitive fields securely
      if (config.api_key) {
        updatePayload.api_key = config.api_key;
      }
    }

    // Upsert integration record in database
    const { data, error } = await supabase
      .from("integrations")
      .upsert(updatePayload, {
        onConflict: "user_id,provider",
      })
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return res.status(500).json({
        success: false,
        status: false,
        message: "Failed to save integration result",
      });
    }

    // Return successful validation response
    return res.json({
      success: true,
      status: validationResult.status,
      message: validationResult.message,
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error("Integration validation error:", error);
    return res.status(500).json({
      success: false,
      status: false,
      message: error.message || "Integration validation failed",
    });
  }
});

/**
 * POST /api/integrations/save
 * Saves integration credentials without validation
 * Request body: { userId, provider, config }
 * Response: { success, data }
 */
router.post("/save", async (req, res) => {
  try {
    const { userId, provider, config } = req.body;

    if (!userId || !provider || !config) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: userId, provider, config",
      });
    }

    // Build update payload
    const updatePayload = {
      user_id: userId,
      provider: provider.toLowerCase(),
      status: config.status === true,
      updated_at: new Date().toISOString(),
    };

    // Add provider-specific fields
    if (config && typeof config === "object") {
      Object.keys(config).forEach((key) => {
        if (key !== "status" && config[key]) {
          updatePayload[key] = config[key];
        }
      });
    }

    // Upsert integration record
    const { data, error } = await supabase
      .from("integrations")
      .upsert(updatePayload, {
        onConflict: "user_id,provider",
      })
      .select();

    if (error) {
      console.error("Supabase save error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save integration",
      });
    }

    return res.json({
      success: true,
      message: "Integration saved successfully",
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error("Integration save error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Integration save failed",
    });
  }
});

/**
 * GET /api/integrations/:userId
 * Fetch all integrations for a user
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId parameter",
      });
    }

    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Fetch integrations error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch integrations",
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get integrations error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch integrations",
    });
  }
});

/**
 * DELETE /api/integrations/:userId/:provider
 * Delete a specific integration
 */
router.delete("/:userId/:provider", async (req, res) => {
  try {
    const { userId, provider } = req.params;

    if (!userId || !provider) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or provider parameter",
      });
    }

    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("user_id", userId)
      .eq("provider", provider.toLowerCase());

    if (error) {
      console.error("Delete integration error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete integration",
      });
    }

    return res.json({
      success: true,
      message: "Integration deleted successfully",
    });
  } catch (error) {
    console.error("Delete integration error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete integration",
    });
  }
});

module.exports = router;
