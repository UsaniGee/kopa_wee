import { describe, expect, it } from "vitest";
import { googleCalendarAllDayLink } from "./calendarLink";

describe("googleCalendarAllDayLink", () => {
  it("creates an all-day event on the given day in Nigeria (UTC+1)", () => {
    // 23:30 UTC on 24 Oct is already 25 Oct in Lagos
    const url = new URL(googleCalendarAllDayLink({ title: "LGA clearance", date: "2026-10-24T23:30:00Z" }));

    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("LGA clearance");
    expect(url.searchParams.get("dates")).toBe("20261025/20261026");
  });

  it("includes details and location only when given", () => {
    const url = new URL(
      googleCalendarAllDayLink({ title: "T", date: "2026-12-31T09:00:00Z", details: "Bring your ID", location: "Ikeja LGA, Lagos" })
    );
    expect(url.searchParams.get("details")).toBe("Bring your ID");
    expect(url.searchParams.get("location")).toBe("Ikeja LGA, Lagos");
    expect(url.searchParams.get("dates")).toBe("20261231/20270101");

    const bare = new URL(googleCalendarAllDayLink({ title: "T", date: "2026-12-31T09:00:00Z" }));
    expect(bare.searchParams.has("details")).toBe(false);
    expect(bare.searchParams.has("location")).toBe(false);
  });
});
