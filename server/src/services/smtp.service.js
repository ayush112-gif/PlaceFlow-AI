const nodemailer = require("nodemailer");

async function sendSMTP(config, recipients, subject, html) {

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  const result = await transporter.sendMail({
    from: `"${config.sender_name}" <${config.sender_email}>`,
    to: recipients.join(","),
    subject,
    html
  });

  return result;
}

module.exports = {
  sendSMTP
};