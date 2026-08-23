import {
  getAvatarUrl,
  profileFromAuthUser,
  userProfileFromRecord,
} from "~/lib/profile";

describe("profile identity", () => {
  test("uses one avatar precedence rule", () => {
    expect(
      getAvatarUrl({
        profileImageUrl: "https://example.com/profile.png",
        metadata: { avatar_url: "https://example.com/metadata.png" },
        seed: "mabel",
      }),
    ).toBe("https://example.com/profile.png");

    expect(
      getAvatarUrl({
        metadata: { avatar_url: "https://example.com/metadata.png" },
        seed: "mabel",
      }),
    ).toBe("https://example.com/metadata.png");

    expect(getAvatarUrl({ seed: "mabel+lou" })).toBe(
      "https://api.dicebear.com/7.x/lorelei/svg?seed=mabel%2Blou",
    );
  });

  test("normalizes an auth user without trusting malformed metadata", () => {
    expect(
      profileFromAuthUser({
        id: "user-1",
        email: "mabel@example.com",
        user_metadata: {
          username: "mabel",
          firstName: 42,
          lastName: "Retriever",
          picture: "https://example.com/mabel.png",
        },
      }),
    ).toEqual({
      id: "user-1",
      username: "mabel",
      firstName: null,
      lastName: "Retriever",
      profileImageUrl: "https://example.com/mabel.png",
    });
  });

  test("maps the database record to the public profile shape", () => {
    expect(
      userProfileFromRecord({
        userId: "user-2",
        username: null,
        firstName: "Lou",
        lastName: null,
        imageUrl: null,
      }),
    ).toEqual({
      id: "user-2",
      username: null,
      firstName: "Lou",
      lastName: null,
      profileImageUrl: null,
    });
  });
});
