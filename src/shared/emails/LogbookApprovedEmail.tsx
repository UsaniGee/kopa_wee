import * as React from "react";

interface LogbookApprovedEmailProps {
  name: string;
  entryDate: string;
  ppaName: string;
}

export default function LogbookApprovedEmail({ name, entryDate, ppaName }: LogbookApprovedEmailProps) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>Logbook Entry Approved — KopaWee</title></head>
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
                    <p style={{ fontSize: "13px", color: "#16a34a", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
                      ✅ LOGBOOK APPROVED
                    </p>
                    <h1 style={{ fontSize: "26px", fontWeight: 600, color: "#121815", margin: "0 0 16px 0" }}>
                      Your PPA logbook entry has been approved!
                    </h1>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                      Hi {name}, your logbook entry has been reviewed and approved by your supervisor at{" "}
                      <strong>{ppaName}</strong>.
                    </p>
                    <table cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", marginBottom: "28px" }}>
                      <tr><td style={{ padding: "16px 20px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#166534" }}>
                          📋 <strong>Entry Date:</strong> {entryDate}<br />
                          🏢 <strong>PPA:</strong> {ppaName}
                        </p>
                      </td></tr>
                    </table>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                      Keep up the great work! Log in to KopaWee to view your full logbook history.
                    </p>
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
