import type { ReactElement } from "react";

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: ReactElement;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions): Promise<SendEmailResult> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn(
      "[email] GMAIL_USER or GMAIL_APP_PASSWORD not set in .env — skipping email send to:",
      to
    );
    return { success: false, error: "EMAIL_NOT_CONFIGURED" };
  }

  try {
    const nodemailer = await import("nodemailer");
    const { render } = await import("@react-email/render");

    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const html = await render(template);

    const info = await transporter.sendMail({
      from: `KopaWee <${gmailUser}>`,
      to,
      subject,
      html,
    });

    console.log("[email] Sent successfully. Message ID:", info.messageId);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
