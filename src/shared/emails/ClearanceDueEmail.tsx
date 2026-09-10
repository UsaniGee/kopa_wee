import * as React from "react";

interface ClearanceDueEmailProps {
  name: string;
  nextEligibleAt: string;
}

export default function ClearanceDueEmail({ name, nextEligibleAt }: ClearanceDueEmailProps) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>Your LGA Clearance Window is Open — KopaWee</title></head>
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
                      ✅ CLEARANCE WINDOW OPEN
                    </p>
                    <h1 style={{ fontSize: "26px", fontWeight: 600, color: "#121815", margin: "0 0 16px 0" }}>
                      Time to mark your LGA clearance, {name}!
                    </h1>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                      Your monthly LGA biometric clearance window is now open. Head to your KopaWee dashboard to mark your clearance before the window closes.
                    </p>
                    <table cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#dcfce7", border: "1px solid #86efac", marginBottom: "28px" }}>
                      <tr><td style={{ padding: "16px 20px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#166534", fontWeight: 600 }}>
                          📅 Next eligible date: {nextEligibleAt}
                        </p>
                      </td></tr>
                    </table>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                      Missing clearance can affect your NYSC allowance. Log in and mark it today.
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
