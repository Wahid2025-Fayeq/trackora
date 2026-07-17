const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Trackora <onboarding@resend.dev>";

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not configured.");
}

const resend = new Resend(resendApiKey);

async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
    });

    throw new Error(error.message || "Failed to send password reset email.");
  }

  console.info("Password reset email accepted by Resend:", {
    id: data?.id,
    to,
  });

  return data;
}

module.exports = {
  sendEmail,
};
