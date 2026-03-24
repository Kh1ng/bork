-- Remap existing Post.authorID values from legacy Clerk IDs to auth.users UUIDs
-- Run this after importing auth.users and Profile data.

BEGIN;

-- Safety snapshot of pre-migration author IDs
CREATE TABLE IF NOT EXISTS "Post_authorID_backup" AS
SELECT id, "authorID", "createdAt"
FROM "Post"
WHERE 1 = 0;

INSERT INTO "Post_authorID_backup" (id, "authorID", "createdAt")
SELECT p.id, p."authorID", p."createdAt"
FROM "Post" p
LEFT JOIN "Post_authorID_backup" b ON b.id = p.id
WHERE b.id IS NULL;

-- Build mapping from Clerk ID (stored in auth metadata) -> Supabase auth UUID (as text)
WITH clerk_map AS (
  SELECT
    (u.raw_user_meta_data->>'clerkId') AS clerk_id,
    u.id::text AS supabase_user_id
  FROM auth.users u
  WHERE u.raw_user_meta_data ? 'clerkId'
)
UPDATE "Post" p
SET "authorID" = m.supabase_user_id
FROM clerk_map m
WHERE p."authorID" = m.clerk_id;

COMMIT;

-- Verification: these should be 0 after successful remap
SELECT COUNT(*) AS unmapped_posts_remaining
FROM "Post" p
WHERE p."authorID" LIKE 'user_%';

-- Verification sample
SELECT p.id, p."authorID", pr.username
FROM "Post" p
LEFT JOIN "Profile" pr ON pr."userId" = p."authorID"
ORDER BY p."createdAt" DESC
LIMIT 20;
