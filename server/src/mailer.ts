import nodemailer from 'nodemailer';

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendReply({
  to,
  toName,
  subject,
  body,
  fromName,
}: {
  to: string;
  toName: string;
  subject: string;
  body: string;
  fromName: string;
}) {
  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_USER;
  const companyName = process.env.COMPANY_NAME ?? 'Shri Tirupati Metal Cast';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#f97316;padding:28px 32px;">
            <p style="margin:0;color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">${companyName}</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:12px;">Official Reply</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Dear ${toName},</p>
            <div style="background:#f8fafc;border-left:3px solid #f97316;border-radius:4px;padding:20px;margin:20px 0;white-space:pre-wrap;font-size:14px;color:#334155;line-height:1.7;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <p style="margin:24px 0 4px;color:#334155;font-size:13px;font-weight:700;">${fromName}</p>
            <p style="margin:0;color:#94a3b8;font-size:12px;">${companyName}</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;">
            <p style="margin:0;color:#94a3b8;font-size:11px;">This email was sent in response to your enquiry. Please do not reply to this message directly — contact us at ${fromEmail}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${fromName} – ${companyName}" <${fromEmail}>`,
    to: `"${toName}" <${to}>`,
    subject,
    text: body,
    html,
  });
}
