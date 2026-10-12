import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";
import { sendEmail } from "@/shared/lib/email";

vi.mock("@/shared/lib/email", () => ({ sendEmail: vi.fn(async () => ({ success: true })) }));

const sos = (body: unknown) => POST(makeRequest("/api/safety/sos", { method: "POST", body }));

function stubUser(saved: { deployedState: string | null; lga: string | null }) {
  prismaMock.user.findUnique.mockResolvedValue({ email: "corper@example.com", name: "Ada", ...saved });
  prismaMock.sOSAlert.create.mockImplementation(async ({ data }: { data: object }) => ({ id: "sos_1", ...data }));
}

describe("POST /api/safety/sos", () => {
  it("returns 401 when signed out", async () => {
    expect((await sos({ latitude: 9.07, longitude: 7.49 })).status).toBe(401);
  });

  it("requires real coordinates", async () => {
    signInAs();
    expect((await sos({})).status).toBe(400);
    // A complete body, so only the out-of-range latitude can cause the 400
    stubUser({ deployedState: "Kaduna", lga: "Chikun" });
    expect((await sos({ latitude: 200, longitude: 7.49, state: "Kaduna", lga: "Chikun" })).status).toBe(400);
    expect(prismaMock.sOSAlert.create).not.toHaveBeenCalled();
  });

  it("stores the device's coordinates and falls back to the saved state/LGA, never a made-up one", async () => {
    signInAs({ id: "user_1" });
    stubUser({ deployedState: "Kaduna", lga: "Chikun" });

    await sos({ latitude: 10.52, longitude: 7.44 });

    expect(prismaMock.sOSAlert.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user_1", latitude: 10.52, longitude: 7.44, state: "Kaduna", lga: "Chikun" }),
    });
  });

  it("labels the area Unknown when neither the device nor the profile has one", async () => {
    signInAs({ id: "user_1" });
    stubUser({ deployedState: null, lga: null });

    await sos({ latitude: 10.52, longitude: 7.44 });

    expect(prismaMock.sOSAlert.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ state: "Unknown", lga: "Unknown" }),
    });
  });

  it("says exactly who was notified and points to 112", async () => {
    signInAs({ id: "user_1" });
    stubUser({ deployedState: "Kaduna", lga: "Chikun" });

    const res = await sos({ latitude: 10.52, longitude: 7.44 });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.notified).toEqual({ emailToYou: true, trustedContacts: false, nyscOfficials: false });
    expect(body.message).toMatch(/112/);
    expect(body.message).not.toMatch(/contacts? (&|and) local NYSC reps notified|BROADCAST SENT/i);
  });

  it("does not claim an email was sent when sending failed", async () => {
    signInAs({ id: "user_1" });
    stubUser({ deployedState: "Kaduna", lga: "Chikun" });
    vi.mocked(sendEmail).mockResolvedValueOnce({ success: false, error: "EMAIL_NOT_CONFIGURED" });

    const body = await (await sos({ latitude: 10.52, longitude: 7.44 })).json();

    expect(body.notified.emailToYou).toBe(false);
    expect(body.message).not.toMatch(/emailed to you/i);
    expect(body.message).toMatch(/112/);
  });
});
