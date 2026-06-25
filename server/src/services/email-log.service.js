const supabase = require("../config/supabase");

async function saveEmailLog(data) {

  return await supabase
    .from("email_logs")
    .insert([data]);
}

module.exports = {
  saveEmailLog
};