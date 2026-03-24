-- Create Profile/Post tables (Railway-compatible shape) then populate Profile from auth.users metadata

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "Post" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  content VARCHAR(255) NOT NULL,
  "authorID" TEXT NOT NULL,
  CONSTRAINT post_author_idx UNIQUE ("authorID", id)
);

CREATE TABLE IF NOT EXISTS "Profile" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  "firstName" TEXT,
  "lastName" TEXT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Post_authorID_idx" ON "Post"("authorID");
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");
CREATE INDEX IF NOT EXISTS "Profile_username_idx" ON "Profile"(username);

-- Populate Profile from auth.users for the imported users
INSERT INTO "Profile" (
  "userId",
  username,
  "firstName",
  "lastName",
  "imageUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  u.id::text,
  u.raw_user_meta_data->>'username' AS username,
  u.raw_user_meta_data->>'firstName' AS "firstName",
  NULLIF(u.raw_user_meta_data->>'lastName', '') AS "lastName",
  u.raw_user_meta_data->>'avatar' AS "imageUrl",
  NOW(),
  NOW()
FROM auth.users u
WHERE lower(u.email) IN (
  'khing@pm.me',
  'carolynspurgin@gmail.com',
  'vsongsang@live.com',
  'cspur43@gmail.com'
)
ON CONFLICT ("userId") DO UPDATE
SET
  username = EXCLUDED.username,
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = NOW();

-- Verify
SELECT email, id FROM auth.users
WHERE lower(email) IN (
  'khing@pm.me',
  'carolynspurgin@gmail.com',
  'vsongsang@live.com',
  'cspur43@gmail.com'
)
ORDER BY email;

SELECT "userId", username, "firstName", "lastName" FROM "Profile"
WHERE username IN ('kh1ng', 'dogmom43', 'borkbork', 'colton')
ORDER BY username;
