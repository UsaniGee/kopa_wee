import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

const sendMail = vi.fn();
const createTransport = vi.fn(() => ({ sendMail }));
vi.mock("nodemailer", () => ({ default: { createTransport } }));
vi.mock("@react-email/render", () => ({
  render: vi.fn(async (_t: unknown, opts?: { plainText?: boolean }) => (opts?.plainText ? "Hello text" : "<p>Hello</p>")),
}));

import { sendEmail } from "./email";

const message = { to: "ada@example.com", subject: "Hi", template: React.createElement("p", null, "Hello") };

describe("sendEmail", () => {
  beforeEach(() => {
    vi.stubEnv("GMAIL_USER", "kopawee.app@gmail.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "abcd efgh ijkl mnop");
  });
  afterEach(() => vi.restoreAllMocks());

  it("returns EMAIL_NOT_CONFIGURED without credentials and does not log the recipient", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(await sendEmail(message)).toEqual({ success: false, error: "EMAIL_NOT_CONFIGURED" });
    expect(JSON.stringify(warn.mock.calls)).not.toContain("ada@example.com");
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("uses short timeouts so callers (SOS, sign-up) are never stuck on a slow mail server", async () => {
    sendMail.mockResolvedValue({ messageId: "<id@gmail>" });
    vi.spyOn(console, "log").mockImplementation(() => {});

    await sendEmail(message);

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000 })
    );
  });

  it("sends HTML with a plain-text alternative from the Gmail account and returns the message id", async () => {
    sendMail.mockResolvedValue({ messageId: "<id@gmail>" });
    vi.spyOn(console, "log").mockImplementation(() => {});

    expect(await sendEmail(message)).toEqual({ success: true, id: "<id@gmail>" });
    expect(sendMail).toHaveBeenCalledWith({
      from: "KopaWee <kopawee.app@gmail.com>",
      to: "ada@example.com",
      subject: "Hi",
      html: "<p>Hello</p>",
      text: "Hello text",
    });
  });

  it("returns EMAIL_SEND_FAILED and logs only the error code and message", async () => {
    const err = Object.assign(new Error("Invalid login: 535 Username and Password not accepted"), {
      code: "EAUTH",
      response: "535-5.7.8 ...",
      command: "AUTH PLAIN",
    });
    sendMail.mockRejectedValue(err);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await sendEmail(message)).toEqual({ success: false, error: "EMAIL_SEND_FAILED" });
    expect(error).toHaveBeenCalledWith("[email] Send failed:", "EAUTH", "Invalid login: 535 Username and Password not accepted");
  });
});
