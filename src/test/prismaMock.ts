import { vi, type Mock } from "vitest";

type ModelMock = Record<string, Mock>;
export type PrismaMock = Record<string, ModelMock> & { $transaction: Mock; $reset: () => void };

/**
 * A stand-in for the Prisma client: any `prisma.<model>.<method>` is a vi.fn()
 * created on first access, so tests only stub the calls they care about.
 * `$transaction` runs a callback against the mock, or resolves an array of promises.
 */
export function createPrismaMock(): PrismaMock {
  const models = new Map<string, ModelMock>();
  const clientFns: Record<string, Mock> = {};

  const modelProxy = (name: string): ModelMock => {
    let model = models.get(name);
    if (!model) {
      const methods: ModelMock = {};
      model = new Proxy(methods, {
        get(target, method: string) {
          target[method] ??= vi.fn();
          return target[method];
        },
      });
      models.set(name, model);
    }
    return model;
  };

  const client = new Proxy({} as PrismaMock, {
    get(_target, prop: string) {
      if (prop === "$reset") {
        return () => {
          models.clear();
          for (const key of Object.keys(clientFns)) delete clientFns[key];
        };
      }
      if (prop === "$transaction") {
        clientFns[prop] ??= vi.fn(async (arg: unknown) =>
          typeof arg === "function"
            ? (arg as (tx: PrismaMock) => unknown)(client)
            : Promise.all(arg as Promise<unknown>[])
        );
        return clientFns[prop];
      }
      if (prop.startsWith("$")) {
        clientFns[prop] ??= vi.fn();
        return clientFns[prop];
      }
      return modelProxy(prop);
    },
  });

  return client;
}

/** Shared instance wired into `@/shared/lib/prisma` by src/test/setup.ts. */
export const prismaMock = createPrismaMock();
