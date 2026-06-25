
const nodemailer = require("nodemailer");

function buildResponse(success, status, message) {
  return {
    success,
    status,
    message,
  };
}

/**
 * SMTP Validation
 */
async function validateSMTP(config) {
  const { host, port, username, password } = config;

  if (!host || !port || !username || !password) {
    return buildResponse(
      false,
      false,
      "SMTP credentials are incomplete"
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user: username,
        pass: password,
      },
    });

    await transporter.verify();

    return buildResponse(
      true,
      true,
      "Connection Successful"
    );
  } catch (error) {
    console.error("SMTP Error:", error.message);

    return buildResponse(
      false,
      false,
      "Invalid Credentials"
    );
  }
}

/**
 * OpenRouter Validation
 */

async function validateOpenRouter(apiKey) {
  if (!apiKey) {
    return buildResponse(false, false, "API Key Required");
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Placement SaaS",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: "Hello",
            },
          ],
          max_tokens: 5,
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER STATUS:", response.status);
    console.log("OPENROUTER RESPONSE:", data);

    if (response.status === 401) {
      return buildResponse(false, false, "Invalid API Key");
    }

    if (response.status === 402) {
      return buildResponse(false, false, "Insufficient Credits");
    }

    if (data?.error) {
      return buildResponse(
        false,
        false,
        data.error.message || "OpenRouter Error"
      );
    }

    if (!response.ok) {
      return buildResponse(false, false, "Connection Failed");
    }

    return buildResponse(true, true, "Connection Successful");
  } catch (error) {
    console.error("OpenRouter Error:", error);

    return buildResponse(
      false,
      false,
      error.message || "Connection Failed"
    );
  }
}



/**
 * Gemini Validation
 */
async function validateGemini(apiKey) {
  if (!apiKey) {
    return buildResponse(
      false,
      false,
      "API Key Required"
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (
      response.status === 400 ||
      response.status === 403
    ) {
      return buildResponse(
        false,
        false,
        "Invalid API Key"
      );
    }

    if (!response.ok) {
      return buildResponse(
        false,
        false,
        "Connection Failed"
      );
    }

    return buildResponse(
      true,
      true,
      "Connection Successful"
    );
  } catch (error) {
    console.error("Gemini Error:", error.message);

    return buildResponse(
      false,
      false,
      error.message
    );
  }
}

/**
 * Brevo Validation
 */
async function validateBrevo(apiKey) {
  if (!apiKey) {
    return buildResponse(
      false,
      false,
      "API Key Required"
    );
  }

  try {
    const response = await fetch(
      "https://api.brevo.com/v3/account",
      {
        headers: {
          "api-key": apiKey.trim(),
        },
      }
    );

    if (response.status === 401) {
      return buildResponse(
        false,
        false,
        "Invalid API Key"
      );
    }

    if (!response.ok) {
      return buildResponse(
        false,
        false,
        "Connection Failed"
      );
    }

    return buildResponse(
      true,
      true,
      "Connection Successful"
    );
  } catch (error) {
    console.error("Brevo Error:", error.message);

    return buildResponse(
      false,
      false,
      error.message
    );
  }
}

module.exports = {
  validateSMTP,
  validateOpenRouter,
  validateGemini,
  validateBrevo,
};
