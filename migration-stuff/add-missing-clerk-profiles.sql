-- Preserve Clerk users that have no email by inserting Profile rows.
-- These users cannot log in via Supabase Auth until they have real email identities.

INSERT INTO "Profile" (
  "userId",
  username,
  "firstName",
  "lastName",
  "imageUrl",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'user_2NzgLEKqUMWYdBBtI3a5gSGNEuF',
    'nala',
    NULL,
    NULL,
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJmZ1JPWnRxaE95YVBEV3VGb3FrbTRIRkU2bCJ9',
    NOW(),
    NOW()
  ),
  (
    'user_2NzgJPmQlWFSgeTmHXhPsLKRzCy',
    'dallas',
    NULL,
    NULL,
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJmZ1JxZXZ3bnJ1NWd5ZlFZM0RXRGhUQmU3OSJ9',
    NOW(),
    NOW()
  )
ON CONFLICT ("userId") DO UPDATE
SET
  username = EXCLUDED.username,
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = NOW();

SELECT "userId", username
FROM "Profile"
WHERE "userId" IN (
  'user_2NzgLEKqUMWYdBBtI3a5gSGNEuF',
  'user_2NzgJPmQlWFSgeTmHXhPsLKRzCy'
)
ORDER BY username;
