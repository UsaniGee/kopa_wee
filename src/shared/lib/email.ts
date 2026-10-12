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
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — email not sent");
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
      // Fail fast: SOS and sign-up wait for this result (Nodemailer's defaults are 2–10 minutes)
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    // A plain-text part alongside the HTML helps the email past spam filters
    const [html, text] = await Promise.all([render(template), render(template, { plainText: true })]);

    const info = await transporter.sendMail({
      from: `KopaWee <${gmailUser}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("[email] Sent successfully. Message ID:", info.messageId);
    return { success: true, id: info.messageId };
  } catch (err) {
    // Code and message only: the full error object carries SMTP command and response details
    console.error("[email] Send failed:", (err as { code?: string }).code, (err as Error).message);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
