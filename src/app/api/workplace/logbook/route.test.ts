import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const post = (body: unknown) => POST(makeRequest("/api/workplace/logbook", { method: "POST", body }));
const entry = { date: "2026-10-12", summary: "Taught JSS2 maths and marked assignments.", hoursWorked: 6 };

describe("POST /api/workplace/logbook", () => {
  it("returns 401 when signed out", async () => {
    expect((await post(entry)).status).toBe(401);
  });

  it("saves the user's own summary and hours for that day", async () => {
    signInAs({ id: "user_1" });
    prismaMock.pPALogbookEntry.findFirst.mockResolvedValue(null);
    prismaMock.pPALogbookEntry.create.mockImplementation(async ({ data }: { data: object }) => ({ id: "log_1", ...data }));

    const res = await post({ ...entry, employerId: "someone_else" });

    expect(res.status).toBe(201);
    expect(prismaMock.pPALogbookEntry.create).toHaveBeenCalledWith({
      data: { userId: "user_1", date: "2026-10-12", summary: entry.summary, hoursWorked: 6 },
    });
  });

  it("rejects fractional, zero or impossible hours", async () => {
    signInAs();
    prismaMock.pPALogbookEntry.findFirst.mockResolvedValue(null);
    for (const hoursWorked of [7.5, 0, 25]) {
      expect((await post({ ...entry, hoursWorked })).status).toBe(400);
    }
    expect(prismaMock.pPALogbookEntry.create).not.toHaveBeenCalled();
  });

  it("rejects a date that is not YYYY-MM-DD", async () => {
    signInAs();
    prismaMock.pPALogbookEntry.findFirst.mockResolvedValue(null);
    expect((await post({ ...entry, date: "yesterday" })).status).toBe(400);
  });

  it("allows one entry per day", async () => {
    signInAs({ id: "user_1" });
    prismaMock.pPALogbookEntry.findFirst.mockResolvedValue({ id: "log_0" });

    const res = await post(entry);

    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("ALREADY_LOGGED");
    expect(prismaMock.pPALogbookEntry.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user_1", date: "2026-10-12" } })
    );
    expect(prismaMock.pPALogbookEntry.create).not.toHaveBeenCalled();
  });
});
