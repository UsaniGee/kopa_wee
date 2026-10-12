import { describe, expect, it } from "vitest";
import { deriveRole, destinationFor, getRouteForRole } from "./roleRoutes";

describe("deriveRole", () => {
  it("maps NYSC status from the session", () => {
    expect(deriveRole("PCM")).toBe("pcm");
    expect(deriveRole("SERVING")).toBe("serving");
    expect(deriveRole("ALUMNI")).toBe("alumni");
    expect(deriveRole(undefined)).toBe("pcm");
  });

  it("lets the legacy special roles win", () => {
    expect(deriveRole("SERVING", "CDS_EXEC")).toBe("cds_exec");
    expect(deriveRole("SERVING", "EMPLOYER")).toBe("ppa");
    expect(deriveRole("SERVING", "LGA_INSPECTOR")).toBe("nysc_official");
  });
});

describe("getRouteForRole", () => {
  it("keeps a route the role may open and falls back to the dashboard otherwise", () => {
    expect(getRouteForRole("/dashboard/workplace", "serving")).toBe("/dashboard/workplace");
    expect(getRouteForRole("/dashboard/workplace", "pcm")).toBe("/dashboard");
  });

  it("keeps settings for every role", () => {
    expect(getRouteForRole("/dashboard/settings", "pcm")).toBe("/dashboard/settings");
    expect(getRouteForRole("/dashboard/settings", "alumni")).toBe("/dashboard/settings");
  });
});

describe("destinationFor", () => {
  it("sends signed-out visitors to sign-up with a redirect back", () => {
    expect(destinationFor("/dashboard/marketplace", null)).toBe("/auth?mode=signup&redirect=%2Fdashboard%2Fmarketplace");
  });

  it("sends signed-in users to the route their session role allows", () => {
    expect(destinationFor("/dashboard/accommodation", { nyscStatus: "SERVING" })).toBe("/dashboard/accommodation");
    expect(destinationFor("/dashboard/accommodation", { nyscStatus: "PCM" })).toBe("/dashboard");
  });
});
