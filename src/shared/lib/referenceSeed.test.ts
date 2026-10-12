import { describe, expect, it, vi } from "vitest";
import { seedAdmin, seedFieldsOfStudy, seedStatesAndLgas } from "./referenceSeed";
import { prismaMock } from "@/test/prismaMock";
import { NIGERIA_STATES_AND_LGAS } from "@/shared/data/nigeriaStatesLgas";
import { DEFAULT_FIELDS_OF_STUDY } from "@/shared/data/referenceData";

const ADMIN_ENV = { SEED_ADMIN_EMAIL: "Ops@KopaWee.ng", SEED_ADMIN_PASSWORD: "a-long-secret-pass" };

describe("seedAdmin", () => {
  it("skips when SEED_ADMIN_* env vars are missing", async () => {
    const log = vi.fn();
    const result = await seedAdmin(prismaMock as never, {}, log);
    expect(result).toBe("skipped");
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("creates the admin from env with a hashed password and never logs the password", async () => {
    const log = vi.fn();
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({});

    const result = await seedAdmin(prismaMock as never, ADMIN_ENV, log);

    expect(result).toBe("created");
    const data = prismaMock.user.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ email: "ops@kopawee.ng", applicationRole: "ADMIN", isVerified: true });
    expect(data.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(data.passwordHash).not.toContain(ADMIN_ENV.SEED_ADMIN_PASSWORD);
    expect(JSON.stringify(log.mock.calls)).not.toContain(ADMIN_ENV.SEED_ADMIN_PASSWORD);
  }, 15_000); // real bcrypt (cost 12) takes ~2 s and can pass 5 s on a busy machine

  it("does not overwrite an existing verified account's password", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "admin_1", isVerified: true, applicationRole: "USER" });
    prismaMock.user.update.mockResolvedValue({});

    const result = await seedAdmin(prismaMock as never, ADMIN_ENV, vi.fn());

    expect(result).toBe("kept");
    const data = prismaMock.user.update.mock.calls[0][0].data;
    expect(data).toEqual({ applicationRole: "ADMIN" });
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("refuses to promote an unverified account (anyone can register the admin email)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "squatter", isVerified: false, applicationRole: "USER" });

    await expect(seedAdmin(prismaMock as never, ADMIN_ENV, vi.fn())).rejects.toThrow(/unverified/);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects a weak seed password", async () => {
    await expect(
      seedAdmin(prismaMock as never, { SEED_ADMIN_EMAIL: "a@b.ng", SEED_ADMIN_PASSWORD: "short" }, vi.fn())
    ).rejects.toThrow(/at least 12/);
  });
});

describe("reference data", () => {
  it("upserts every state and every LGA", async () => {
    prismaMock.state.upsert.mockImplementation(async ({ create }: { create: { code: string } }) => ({ id: create.code }));
    prismaMock.lGA.upsert.mockResolvedValue({});

    await seedStatesAndLgas(prismaMock as never);

    const lgaTotal = NIGERIA_STATES_AND_LGAS.reduce((n, s) => n + s.lgas.length, 0);
    expect(prismaMock.state.upsert).toHaveBeenCalledTimes(NIGERIA_STATES_AND_LGAS.length);
    expect(prismaMock.lGA.upsert).toHaveBeenCalledTimes(lgaTotal);
  });

  it("upserts the default fields of study", async () => {
    prismaMock.formOption.upsert.mockResolvedValue({});
    await seedFieldsOfStudy(prismaMock as never);
    expect(prismaMock.formOption.upsert).toHaveBeenCalledTimes(DEFAULT_FIELDS_OF_STUDY.length);
  });
});
