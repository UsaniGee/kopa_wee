import { describe, expect, it } from "vitest";
import { GET, PATCH } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const patch = (body: unknown) => PATCH(makeRequest("/api/users/me", { method: "PATCH", body }));

/** Lagos exists with LGA Ikeja; any other state or LGA is unknown. */
function stubLocations() {
  prismaMock.state.findUnique.mockImplementation(async ({ where }: { where: { name: string } }) =>
    where.name === "Lagos" ? { id: "state_lagos" } : null
  );
  prismaMock.lGA.findUnique.mockImplementation(
    async ({ where }: { where: { stateId_name: { stateId: string; name: string } } }) =>
      where.stateId_name.stateId === "state_lagos" && where.stateId_name.name === "Ikeja" ? { id: "lga_ikeja" } : null
  );
}

function stubWrites() {
  prismaMock.user.findUnique.mockResolvedValue({ deployedState: null, nyscStatus: "PCM" });
  prismaMock.user.findFirst.mockResolvedValue(null);
  prismaMock.userStatusHistory.count.mockResolvedValue(0);
  prismaMock.user.update.mockImplementation(async ({ data }: { data: object }) => ({ id: "user_1", ...data }));
  prismaMock.nYSCJourney.upsert.mockResolvedValue({});
  prismaMock.userStatusHistory.create.mockResolvedValue({});
}

describe("GET /api/users/me", () => {
  const journey = { institution: "University of Nigeria", courseOfStudy: "Law", batch: "2026 Batch A", stream: null };

  it("returns 401 when signed out", async () => {
    expect((await GET()).status).toBe(401);
  });

  it("returns the journey details and marks onboarding complete once phone and institution are saved", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_1", phone: "+2348031234567", nyscJourney: journey });

    const body = await (await GET()).json();

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user_1" } }));
    expect(body.data).toMatchObject({ journey, onboardingComplete: true });
    expect(body.data).not.toHaveProperty("nyscJourney");
  });

  it("marks onboarding incomplete for a fresh sign-up", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_1", phone: null, nyscJourney: null });

    const body = await (await GET()).json();

    expect(body.data).toMatchObject({ journey: null, onboardingComplete: false });
  });
});

describe("PATCH /api/users/me", () => {
  it("returns 401 when signed out", async () => {
    expect((await patch({ phone: "08031234567" })).status).toBe(401);
  });

  it("saves profile and journey fields for the session user only", async () => {
    signInAs({ id: "user_1" });
    stubLocations();
    stubWrites();

    const res = await patch({
      userId: "someone_else",
      phone: "0803 123 4567",
      deployedState: "Lagos",
      lga: "Ikeja",
      stateCode: "la/26a/1234",
      callUpNo: "NYSC/UNN/2026/123456",
      ppaName: "Grace High School",
      institution: "University of Nigeria",
      courseOfStudy: "Computer Science",
      batch: "2026 Batch A",
      stream: "Stream I",
    });

    expect(res.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user_1" },
        data: expect.objectContaining({
          phone: "+2348031234567",
          deployedState: "Lagos",
          lga: "Ikeja",
          stateCode: "LA/26A/1234",
          callUpNo: "NYSC/UNN/2026/123456",
          ppaName: "Grace High School",
        }),
      })
    );
    expect(prismaMock.nYSCJourney.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_1" },
        update: { institution: "University of Nigeria", courseOfStudy: "Computer Science", batch: "2026 Batch A", stream: "Stream I" },
      })
    );
  });

  it("rejects a malformed state code with 400", async () => {
    signInAs({ id: "user_1" });
    const res = await patch({ stateCode: "LA-26-1234" });
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns 409 when the state code belongs to another user", async () => {
    signInAs({ id: "user_1" });
    stubWrites();
    prismaMock.user.findFirst.mockResolvedValue({ id: "user_2" });

    const res = await patch({ stateCode: "LA/26A/1234" });

    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("STATE_CODE_TAKEN");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects an unknown state", async () => {
    signInAs({ id: "user_1" });
    stubLocations();
    stubWrites();
    const res = await patch({ deployedState: "Atlantis" });
    expect(res.status).toBe(400);
  });

  it("rejects an LGA that is not in the chosen state", async () => {
    signInAs({ id: "user_1" });
    stubLocations();
    stubWrites();
    const res = await patch({ deployedState: "Lagos", lga: "Nsukka" });
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects an invalid phone number", async () => {
    signInAs({ id: "user_1" });
    expect((await patch({ phone: "12345" })).status).toBe(400);
  });

  it("lets a new user declare their NYSC status once and logs it", async () => {
    signInAs({ id: "user_1" });
    stubWrites();

    const res = await patch({ nyscStatus: "SERVING" });

    expect(res.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ nyscStatus: "SERVING", role: "SERVING_CORPER" }) })
    );
    expect(prismaMock.userStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user_1", previousStatus: "PCM", newStatus: "SERVING", changedBy: "user_1" }),
    });
    expect((await res.json()).statusChanged).toBe(true);
  });

  it("refuses to change NYSC status here once the user has status history", async () => {
    signInAs({ id: "user_1" });
    stubWrites();
    prismaMock.userStatusHistory.count.mockResolvedValue(1);

    const res = await patch({ nyscStatus: "ALUMNI" });

    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("STATUS_ALREADY_SET");
  });

  it("clears the old LGA when the deployed state changes without a new LGA", async () => {
    signInAs({ id: "user_1" });
    stubLocations();
    stubWrites();
    prismaMock.user.findUnique.mockResolvedValue({ deployedState: "Kaduna", nyscStatus: "PCM" });

    expect((await patch({ deployedState: "Lagos" })).status).toBe(200);

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ deployedState: "Lagos", lga: null }) })
    );
  });
});
