-- SIMPLE SQL Migration: Create Supabase Auth Users + Profiles from Clerk Data
-- This version is tailored to your auth.users schema snapshot.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS tmp_clerk_users;
CREATE TEMP TABLE tmp_clerk_users (
  email text PRIMARY KEY,
  clerk_id text NOT NULL,
  username text,
  first_name text,
  last_name text,
  image_url text
);

INSERT INTO tmp_clerk_users (email, clerk_id, username, first_name, last_name, image_url)
VALUES
  (
    'khing@pm.me',
    'user_2iNN5e1ji2SEShOsCgRARwYJLQt',
    'kh1ng',
    'Colton',
    'Spurgin',
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaU5ONWRhajNtUHlNRkMxd3VRWThhcnZOR1AifQ'
  ),
  (
    'carolynspurgin@gmail.com',
    'user_2OP4aJqfJOLSfoVjMRVBJLhrC7y',
    'dogmom43',
    'Carolyn',
    'Spurgin',
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yT1A0YUl4QXZ6RzVwcU9uZ1lGbEtmb1ppNVguanBlZyJ9'
  ),
  (
    'vsongsang@live.com',
    'user_2O2hWhvcrKbdes5yjYTtpbnHSac',
    'borkbork',
    'Tak',
    'Oyaki',
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJPMmhXemhFTk04NUxsNmZBbDZBWUhaYloxby5qcGVnIn0'
  ),
  (
    'cspur43@gmail.com',
    'user_2NzXQTqLosAtfnknSdulnif3rR3',
    'colton',
    'Colton',
    NULL,
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTnpYUWpKa3hEMGVNOUlsMFV1YXp3eldyR3guanBlZyJ9'
  );

-- Insert missing auth users only (no crypt/gen_salt usage)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
SELECT
  NULL,
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  t.email,
  NULL,
  NOW(),
  NOW(),
  jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  jsonb_build_object(
    'clerkId', t.clerk_id,
    'username', t.username,
    'firstName', t.first_name,
    'lastName', t.last_name,
    'avatar', t.image_url
  ),
  NOW(),
  NOW(),
  false,
  false
FROM tmp_clerk_users t
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(t.email)
);

-- Upsert profiles from auth.users by email
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
  t.username,
  t.first_name,
  t.last_name,
  t.image_url,
  NOW(),
  NOW()
FROM tmp_clerk_users t
JOIN auth.users u ON lower(u.email) = lower(t.email)
ON CONFLICT ("userId") DO UPDATE
SET
  username = EXCLUDED.username,
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = NOW();

COMMIT;

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
