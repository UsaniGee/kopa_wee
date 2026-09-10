/**
 * KopaWee Email Service
 * Wraps Resend for transactional email sending.
 * Gracefully degrades (logs warning, returns failure) if RESEND_API_KEY is not set.
 */

import type { ReactElement } from "react";

export interface SendEmailOptions {
  to: string;
  subject: string;
  /** A React Email component rendered to HTML */
  template: ReactElement;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send to:", to);
    return { success: false, error: "EMAIL_NOT_CONFIGURED" };
  }

  try {
    // Dynamic imports to avoid build failures when packages are not yet installed
    const { Resend } = await import("resend");
    const { render } = await import("@react-email/render");

    const resend = new Resend(apiKey);
    const html = await render(template);

    const { data, error } = await resend.emails.send({
      from: "KopaWee <no-reply@kopawee.ng>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
