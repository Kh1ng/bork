export type UserProfile = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

export type ProfileRecord = {
  userId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

export const PROFILE_SELECT = "userId, username, firstName, lastName, imageUrl";

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: unknown;
};

const metadataString = (metadata: unknown, ...keys: string[]) => {
  if (!metadata || typeof metadata !== "object") return null;

  const values = metadata as Record<string, unknown>;
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "string" && value.length > 0) return value;
  }

  return null;
};

/** Resolves persisted and auth-provider avatars before using a deterministic fallback. */
export const getAvatarUrl = ({
  profileImageUrl,
  metadata,
  seed,
}: {
  profileImageUrl?: unknown;
  metadata?: unknown;
  seed?: string | null;
}) => {
  const savedImage =
    typeof profileImageUrl === "string" && profileImageUrl.length > 0
      ? profileImageUrl
      : null;

  return (
    savedImage ??
    metadataString(metadata, "avatar_url", "avatar", "picture") ??
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed || "default")}`
  );
};

/** Normalizes Supabase auth metadata into the profile shape used by every feed view. */
export const profileFromAuthUser = (user: AuthUser): UserProfile => ({
  id: user.id,
  username:
    metadataString(user.user_metadata, "username") ??
    user.email?.split("@")[0] ??
    null,
  firstName: metadataString(user.user_metadata, "firstName"),
  lastName: metadataString(user.user_metadata, "lastName"),
  profileImageUrl: metadataString(
    user.user_metadata,
    "avatar_url",
    "avatar",
    "picture",
  ),
});

/** Maps a database profile row without inventing display values for missing fields. */
export const userProfileFromRecord = (profile: ProfileRecord): UserProfile => ({
  id: profile.userId,
  username: profile.username,
  firstName: profile.firstName,
  lastName: profile.lastName,
  profileImageUrl: profile.imageUrl,
});
