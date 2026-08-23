import { appRouter } from "~/server/api/root";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createPagesServerClient: jest.fn(),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

jest.mock("superjson", () => ({
  __esModule: true,
  default: {
    serialize: (value: unknown) => ({ json: value }),
    deserialize: ({ json }: { json: unknown }) => json,
  },
}));

describe("authenticated router procedures", () => {
  test("reject an anonymous caller at the shared private-procedure seam", async () => {
    const caller = appRouter.createCaller({
      userId: null,
      supabase: {},
      supabasePublic: {},
      supabaseAdmin: {},
      session: null,
    } as never);

    await expect(caller.profile.getCurrentProfile()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });

    await expect(caller.posts.create({ content: "hello pups" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
