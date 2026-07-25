function passwordResetEmail(resetUrl, name) {
  return {
    subject: "Reset your Trackora password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:32px;">
        <h2 style="color:#2563eb;">Trackora</h2>

        <p>Hello ${name},</p>

        <p>
          We received a request to reset your password.
          Click the button below to create a new password.
        </p>

        <p style="margin:32px 0;">
          <a
            href="${resetUrl}"
            style="
              background:#2563eb;
              color:#ffffff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              display:inline-block;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link expires in 15 minutes.</p>

        <p>
          If you didn't request this password reset, you can safely ignore this
          email.
        </p>

        <hr />

        <p style="font-size:12px;color:#6b7280;">
          © Trackora
        </p>
      </div>
    `,
  };
}

module.exports = passwordResetEmail;
