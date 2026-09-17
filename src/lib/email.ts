const RESEND_API = "https://api.resend.com/emails";

export async function sendFeedbackEmail({
  email,
  message,
}: {
  email: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const feedbackTo = process.env.FEEDBACK_EMAIL ?? "feedback@grotegut-digital.de";

  if (!apiKey || !from) {
    console.info(
      `[email] Feedback (dev) — RESEND_API_KEY or EMAIL_FROM missing.\n` +
        `From: ${email}\nMessage: ${message}`,
    );
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://www.bankrollary.com";
  const escapedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8faf9;font-family:'Segoe UI',system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf9;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

        <tr>
          <td style="background:#ffffff;border:1px solid #e2e8e6;border-radius:12px 12px 0 0;padding:28px 32px;border-bottom:none">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#6b7e78">Bankrollary</p>
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#111816">User Feedback</h1>
          </td>
        </tr>

        <tr>
          <td style="background:linear-gradient(90deg,transparent,#0e9f7a,transparent);height:2px;font-size:0;line-height:0">&nbsp;</td>
        </tr>

        <tr>
          <td style="background:#ffffff;border:1px solid #e2e8e6;border-top:none;border-bottom:none;padding:28px 32px">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f0f3f2">
                  <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6b7e78">Email</span><br>
                  <a href="mailto:${email}" style="font-size:15px;color:#0e9f7a;text-decoration:none">${email}</a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6b7e78">Message</p>
            <div style="background:#f8faf9;border:1px solid #e2e8e6;border-radius:8px;padding:16px 20px;font-size:15px;line-height:1.65;color:#111816;white-space:pre-wrap">${escapedMessage}</div>

            <p style="margin:20px 0 0;font-size:13px;color:#6b7e78">
              Reply directly to this email to reach the user.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f0f3f2;border:1px solid #e2e8e6;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
            <p style="margin:0;font-size:12px;color:#6b7e78">
              Sent via the feedback form on
              <a href="${appUrl}" style="color:#0e9f7a;text-decoration:none">Bankrollary</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [feedbackTo],
      reply_to: email,
      subject: "[Bankrollary] Feedback & Ideas",
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend feedback error:", res.status, body);
    throw new Error("Feedback email could not be sent.");
  }
}
