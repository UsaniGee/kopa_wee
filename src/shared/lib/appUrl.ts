/**
 * Public base URL for links in emails. Production must set NEXTAUTH_URL: a missing value
 * would otherwise send users links to localhost.
 */
export function appBaseUrl(): string {
  const url = process.env.NEXTAUTH_URL?.trim();
  if (url) return url.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_URL must be set in production (used for links in emails)");
  }
  return "http://localhost:3000";
}
