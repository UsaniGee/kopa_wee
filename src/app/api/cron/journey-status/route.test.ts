import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const PAST = new Date("2020-01-01T00:00:00Z");
const FUTURE = new Date("2999-01-01T00:00:00Z");

function stubTransitionWrites() {
  prismaMock.user.update.mockResolvedValue({});
  prismaMock.userStatusHistory.create.mockResolvedValue({});
  prismaMock.notification.create.mockResolvedValue({});
}

describe("GET /api/cron/journey-status (scheduled)", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "test-secret";
  });
  afterEach(() => {
    delete process.env.CRON_SECRET;
  });

  const cron = (auth?: string) =>
    GET(makeRequest("/api/cron/journey-status", { headers: auth ? { authorization: auth } : {} }));

  it("returns 503 when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;
    expect((await cron("Bearer anything")).status).toBe(503);
  });

  it("returns 401 for a wrong bearer token", async () => {
    expect((await cron("Bearer wrong")).status).toBe(401);
  });

  it("records system transitions with changedBy null, not a fake user id", async () => {
    prismaMock.nYSCJourney.findMany
      .mockResolvedValueOnce([{ userId: "pcm_1" }])
      .mockResolvedValueOnce([{ userId: "serving_1" }]);
    stubTransitionWrites();

    const res = await cron("Bearer test-secret");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toEqual({ pcmToServing: 1, servingToAlumni: 1, errors: 0 });
    const historyWrites = prismaMock.userStatusHistory.create.mock.calls.map((c) => c[0].data);
    expect(historyWrites).toEqual([
      expect.objectContaining({ userId: "pcm_1", newStatus: "SERVING", changedBy: null, changeType: "AUTOMATIC" }),
      expect.objectContaining({ userId: "serving_1", newStatus: "ALUMNI", changedBy: null, changeType: "AUTOMATIC" }),
    ]);
  });
});

describe("POST /api/cron/journey-status (self-evaluation)", () => {
  // POST takes no request: a body userId can't even reach the handler
  const evaluate = () => POST();

  it("returns 401 when signed out", async () => {
    expect((await evaluate()).status).toBe(401);
  });

  it("evaluates only the signed-in user", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({
      nyscStatus: "PCM",
      nyscJourney: { campExitDate: PAST, serviceEndDate: FUTURE },
    });
    stubTransitionWrites();

    const res = await evaluate();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ transitioned: true, newStatus: "SERVING" });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user_1" } }));
    expect(prismaMock.userStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user_1", changedBy: null }),
    });
  });

  it("does nothing when no date has passed", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({
      nyscStatus: "PCM",
      nyscJourney: { campExitDate: FUTURE, serviceEndDate: FUTURE },
    });

    const body = await (await evaluate()).json();

    expect(body.transitioned).toBe(false);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
