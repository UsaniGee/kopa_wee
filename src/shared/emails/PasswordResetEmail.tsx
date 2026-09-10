import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>Reset your KopaWee password</title></head>
      <body style={{ backgroundColor: "#eaf5ed", margin: 0, padding: 0, fontFamily: "Helvetica, Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#eaf5ed", padding: "40px 20px" }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff", maxWidth: "560px", width: "100%" }}>
                <tr>
                  <td style={{ backgroundColor: "#121815", padding: "32px 40px" }}>
                    <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "20px", letterSpacing: "0.15em" }}>
                      KOPA<span style={{ color: "#34d399" }}>&apos;WEE</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "40px" }}>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
                      PASSWORD RESET
                    </p>
                    <h1 style={{ fontSize: "26px", fontWeight: 600, color: "#121815", margin: "0 0 20px 0" }}>
                      Reset your password, {name}
                    </h1>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 28px 0" }}>
                      We received a request to reset the password for your KopaWee account. Click the button below to choose a new password.
                    </p>
                    <table cellPadding={0} cellSpacing={0} style={{ margin: "0 0 32px 0" }}>
                      <tr>
                        <td style={{ backgroundColor: "#16a34a", padding: "14px 32px" }}>
                          <a href={resetUrl} style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                            RESET PASSWORD →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px 0" }}>Or copy this link:</p>
                    <p style={{ fontSize: "11px", color: "#64748b", wordBreak: "break-all", margin: "0 0 32px 0", fontFamily: "monospace" }}>{resetUrl}</p>
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                        ⚠️ This link expires in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email — your password will not change.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#f8fafc", padding: "20px 40px", borderTop: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, textAlign: "center" }}>© 2026 KOPAWEE · NYSC COMPANION PLATFORM</p>
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
