import * as React from "react";

interface SOSAlertEmailProps {
  name: string;
  location: string;
  timestamp: string;
  alertId: string;
}

export default function SOSAlertEmail({ name, location, timestamp, alertId }: SOSAlertEmailProps) {
  return (
    <html>
      <head><meta charSet="utf-8" /><title>🚨 SOS Alert — KopaWee Safety</title></head>
      <body style={{ backgroundColor: "#fff1f2", margin: 0, padding: 0, fontFamily: "Helvetica, Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#fff1f2", padding: "40px 20px" }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff", maxWidth: "560px", width: "100%", border: "2px solid #ef4444" }}>
                <tr>
                  <td style={{ backgroundColor: "#ef4444", padding: "20px 40px" }}>
                    <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px", letterSpacing: "0.2em" }}>
                      🚨 EMERGENCY SOS ALERT
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "32px 40px" }}>
                    <h2 style={{ fontSize: "22px", color: "#991b1b", margin: "0 0 16px 0" }}>
                      Corps member needs help!
                    </h2>
                    <p style={{ fontSize: "15px", color: "#374151", margin: "0 0 20px 0" }}>
                      <strong>{name}</strong> has triggered an SOS emergency alert on KopaWee.
                    </p>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", marginBottom: "24px" }}>
                      <tr><td style={{ padding: "20px" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>📍 Location:</strong> {location}</p>
                        <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>🕐 Time:</strong> {timestamp}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", fontFamily: "monospace" }}>Alert ID: {alertId}</p>
                      </td></tr>
                    </table>
                    <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px 0", fontWeight: 600 }}>
                      Please take action immediately and contact the corps member or local NYSC office.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#fef2f2", padding: "16px 40px", borderTop: "1px solid #fecaca" }}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, textAlign: "center" }}>
                      KOPAWEE SAFETY SYSTEM · This is an automated emergency notification
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
