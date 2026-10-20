import { describe, expect, it } from "vitest";
import { deriveRole, destinationFor, getRouteForRole, postSignInDestination } from "./roleRoutes";

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

describe("postSignInDestination", () => {
  const member = { applicationRole: "USER", nyscStatus: "SERVING", role: "SERVING_CORPER", onboardingComplete: true };
  const admin = { ...member, applicationRole: "ADMIN" };

  it("sends admins to the admin panel, even with an unfinished profile", () => {
    expect(postSignInDestination(admin, null)).toBe("/admin");
    expect(postSignInDestination({ ...admin, onboardingComplete: false }, null)).toBe("/admin");
  });

  it("lets an admin who followed a link to a user page go there", () => {
    expect(postSignInDestination(admin, "/dashboard/marketplace")).toBe("/dashboard/marketplace");
  });

  it("sends members with an unfinished profile to onboarding, keeping the redirect", () => {
    expect(postSignInDestination({ ...member, onboardingComplete: false }, null)).toBe("/onboarding");
    expect(postSignInDestination({ ...member, onboardingComplete: false }, "/dashboard/workplace")).toBe(
      "/onboarding?redirect=%2Fdashboard%2Fworkplace"
    );
  });

  it("sends members to the route their role allows, or the dashboard", () => {
    expect(postSignInDestination(member, "/dashboard/workplace")).toBe("/dashboard/workplace");
    expect(postSignInDestination({ ...member, nyscStatus: "PCM", role: "PCM" }, "/dashboard/workplace")).toBe("/dashboard");
    expect(postSignInDestination(member, null)).toBe("/dashboard");
  });

  it("falls back to the dashboard when the profile could not be loaded", () => {
    expect(postSignInDestination(null, null)).toBe("/dashboard");
  });
});
