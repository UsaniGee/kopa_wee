import * as React from "react";

interface AdminInviteEmailProps {
  inviterName: string;
  inviteUrl: string;
  role: string;
  expiresIn: string;
}

export default function AdminInviteEmail({ inviterName, inviteUrl, role, expiresIn }: AdminInviteEmailProps) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>KopaWee Admin Invitation</title></head>
      <body style={{ backgroundColor: "#0a0f0d", margin: 0, padding: 0, fontFamily: "Helvetica, Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#0a0f0d", padding: "40px 20px" }}>
          <tr><td align="center">
            <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#121815", maxWidth: "560px", width: "100%", border: "1px solid #ef4444" }}>
              <tr><td style={{ backgroundColor: "#0a0f0d", padding: "24px 40px", borderBottom: "1px solid #ef444430" }}>
                <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px", letterSpacing: "0.15em" }}>
                  KOPA<span style={{ color: "#ef4444" }}>&apos;WEE</span>
                </span>
                <span style={{ float: "right", color: "#ef4444", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", fontFamily: "monospace" }}>ADMIN INVITE</span>
              </td></tr>
              <tr><td style={{ padding: "40px" }}>
                <p style={{ fontSize: "11px", color: "#ef4444", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, fontFamily: "monospace" }}>
                  PLATFORM CONTROL CENTER
                </p>
                <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", margin: "0 0 20px 0" }}>
                  You have been invited as {role}
                </h1>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                  <strong style={{ color: "#ffffff" }}>{inviterName}</strong> has invited you to join the KopaWee platform admin team as <strong style={{ color: "#ef4444" }}>{role}</strong>.
                </p>
                <table cellPadding={0} cellSpacing={0} style={{ margin: "0 0 32px 0" }}>
                  <tr><td style={{ backgroundColor: "#ef4444", padding: "14px 32px" }}>
                    <a href={inviteUrl} style={{ color: "#ffffff", fontWeight: 700, fontSize: "12px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      ACCEPT INVITATION →
                    </a>
                  </td></tr>
                </table>
                <p style={{ fontSize: "12px", color: "#64748b", wordBreak: "break-all", margin: "0 0 24px 0", fontFamily: "monospace" }}>{inviteUrl}</p>
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                    ⚠️ This invite expires in <strong style={{ color: "#94a3b8" }}>{expiresIn}</strong>. All admin sessions are logged and audited.
                  </p>
                </div>
              </td></tr>
              <tr><td style={{ backgroundColor: "#080c0a", padding: "16px 40px", borderTop: "1px solid #ef444420" }}>
                <p style={{ fontSize: "10px", color: "#374151", margin: 0, fontFamily: "monospace", textAlign: "center" }}>
                  KOPAWEE PLATFORM CONTROL CENTER · RESTRICTED ACCESS
                </p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
    </html>
  );
}
