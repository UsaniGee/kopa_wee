import * as React from "react";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export default function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your KopaWee email</title>
      </head>
      <body style={{ backgroundColor: "#eaf5ed", margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', Helvetica, Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#eaf5ed", padding: "40px 20px" }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff", maxWidth: "560px", width: "100%" }}>

                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: "#121815", padding: "32px 40px" }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td>
                          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "20px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                            KOPA<span style={{ color: "#34d399" }}>&apos;WEE</span>
                          </span>
                        </td>
                        <td align="right">
                          <span style={{ color: "#34d399", fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                            NYSC COMPANION
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "40px" }}>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
                      VERIFY YOUR ACCOUNT
                    </p>
                    <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#121815", margin: "0 0 20px 0", lineHeight: 1.2 }}>
                      Welcome, {name} 👋
                    </h1>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 32px 0" }}>
                      You&apos;re one step away from accessing your KopaWee companion — camp guides, clearance tracking, accommodation, marketplace, and more.
                    </p>
                    <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 24px 0" }}>
                      Click the button below to verify your email and complete registration.
                    </p>

                    {/* CTA Button */}
                    <table cellPadding={0} cellSpacing={0} style={{ margin: "0 0 32px 0" }}>
                      <tr>
                        <td style={{ backgroundColor: "#16a34a", padding: "14px 32px" }}>
                          <a
                            href={verificationUrl}
                            style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.15em" }}
                          >
                            VERIFY EMAIL ADDRESS →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px 0" }}>
                      Or copy this link into your browser:
                    </p>
                    <p style={{ fontSize: "11px", color: "#64748b", wordBreak: "break-all", margin: "0 0 32px 0", fontFamily: "monospace" }}>
                      {verificationUrl}
                    </p>

                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                        This link expires in 24 hours. If you did not create a KopaWee account, you can safely ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: "#f8fafc", padding: "20px 40px", borderTop: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, textAlign: "center", letterSpacing: "0.1em" }}>
                      © 2026 KOPAWEE · SUPPORTING 36 STATES + FCT · <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Unsubscribe</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
