import { afterEach, vi } from "vitest";
import { prismaMock } from "./prismaMock";
import { signOut } from "./authMock";

// Route handlers import these at module load; tests never touch a real DB or session.
// Factories are hoisted, so they import the shared mocks lazily instead of closing over them.
vi.mock("@/shared/lib/prisma", async () => ({
  prisma: (await import("./prismaMock")).prismaMock,
}));
vi.mock("@/shared/lib/apiAuth", async () => (await import("./authMock")).apiAuthMock);

afterEach(() => {
  signOut();
  prismaMock.$reset();
});
