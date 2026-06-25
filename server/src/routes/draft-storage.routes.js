const express = require("express");
const router = express.Router();

const supabase =
  require("../lib/supabase");

router.post("/save", async (req, res) => {
  try {

    const {
      user_id,
      company,
      role,
      draft_type,
      content
    } = req.body;

    const { data, error } =
      await supabase
        .from("drafts")
        .insert([
          {
            user_id,
            company,
            role,
            draft_type,
            content
          }
        ])
        .select();

    if (error) throw error;

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

router.get("/", async (req, res) => {

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "user_id required"
    });
  }

  const { data, error } =
    await supabase
      .from("drafts")
      .select("*")
      .eq("user_id", user_id)
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);

});

module.exports = router;