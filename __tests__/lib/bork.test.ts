import { BORK_MAX_LENGTH, borkContentSchema } from "~/lib/bork";

describe("bork content", () => {
  test("trims valid content", () => {
    expect(borkContentSchema.parse("  good dog  ")).toBe("good dog");
  });

  test("rejects empty and overlong content", () => {
    expect(borkContentSchema.safeParse("   ").success).toBe(false);
    expect(borkContentSchema.safeParse("x".repeat(BORK_MAX_LENGTH + 1)).success).toBe(false);
  });
});
