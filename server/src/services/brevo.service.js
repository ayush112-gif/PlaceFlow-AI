const axios = require("axios");

async function sendBrevo(config, recipients, subject, html) {
  try {

    console.log("BREVO CONFIG:");
    console.log({
      sender_name: config.sender_name,
      sender_email: config.sender_email,
      recipients
    });

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        
  sender: {
  name: config.sender_name,
  email: config.sender_email
}
,

        to: recipients.map(email => ({
          email
        })),

        subject,
        htmlContent: html
      },
      {
        headers: {
          "api-key": config.api_key,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {

    console.log("========== BREVO ERROR ==========");
    console.log(error.response?.data);
    console.log("===============================");

    throw error;
  }
}

module.exports = {
  sendBrevo
};