const express = require("express");
const router = express.Router();

const supabase = require("../lib/supabase");

router.post("/add", async (req, res) => {
  try {

    console.log("REQUEST BODY:", req.body);

    const {
      userId,
      name,
      email,
      roll_no,
      branch,
      section,
      year
    } = req.body;

    const { data, error } =
      await supabase
        .from("students")
        .insert([
          {
            user_id: userId,
            name,
            email,
            roll_no,
            branch,
            section,
            year
          }
        ])
        .select();

    console.log("SUPABASE DATA:", data);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);

  } catch (error) {

    console.error(
      "STUDENT ADD ERROR:",
      error
    );

    res.status(500).json({
      error: error.message
    });

  }
});

router.get("/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const { data, error } =
      await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false
        });

    console.log("GET STUDENTS ERROR:", error);

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);

  } catch (error) {

    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;