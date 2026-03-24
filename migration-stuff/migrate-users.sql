-- SQL Migration: Create Supabase Auth Users from Clerk Data
-- Run this in Supabase SQL Editor
-- This preserves all user data and creates corresponding profiles

-- Step 1: Insert into auth.users
-- Note: The user IDs are generated, but we store the Clerk ID in user_metadata for reference

INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, user_metadata, created_at, updated_at, last_sign_in_at, phone, phone_confirmed_at, confirmation_sent_at, recovery_sent_at, encrypted_password, email_change, email_change_token_new, email_change_token_old, email_change_confirm_token, recovery_token, raw_app_meta_data, app_metadata, aud, confirmation_token, recovery_token_expires_at, email_change_token_expires_at, phone_change_token_expires_at, phone_change_token, phone_change_confirmed_at, banned_until, reauthentication_sent_at, reauthentication_token)
VALUES
  (
    gen_random_uuid(),
    'khing@pm.me',
    NOW(),
    '{"clerkId": "user_2iNN5e1ji2SEShOsCgRARwYJLQt", "username": "kh1ng", "firstName": "Colton", "lastName": "Spurgin", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaU5ONWRhajNtUHlNRkMxd3VRWThhcnZOR1AifQ"}',
    '{"clerkId": "user_2iNN5e1ji2SEShOsCgRARwYJLQt", "username": "kh1ng", "firstName": "Colton", "lastName": "Spurgin", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaU5ONWRhajNtUHlNRkMxd3VRWThhcnZOR1AifQ"}',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}',
    '{"provider": "clerk", "providers": ["clerk"]}',
    'authenticated',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'carolynspurgin@gmail.com',
    NOW(),
    '{"clerkId": "user_2OP4aJqfJOLSfoVjMRVBJLhrC7y", "username": "dogmom43", "firstName": "Carolyn", "lastName": "Spurgin", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yT1A0YUl4QXZ6RzVwcU9uZ1lGbEtmb1ppNVguanBlZyJ9"}',
    '{"clerkId": "user_2OP4aJqfJOLSfoVjMRVBJLhrC7y", "username": "dogmom43", "firstName": "Carolyn", "lastName": "Spurgin", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yT1A0YUl4QXZ6RzVwcU9uZ1lGbEtmb1ppNVguanBlZyJ9"}',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}',
    '{"provider": "clerk", "providers": ["clerk"]}',
    'authenticated',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'vsongsang@live.com',
    NOW(),
    '{"clerkId": "user_2O2hWhvcrKbdes5yjYTtpbnHSac", "username": "borkbork", "firstName": "Tak", "lastName": "Oyaki", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJPMmhXemhFTk04NUxsNmZBbDZBWUhaYloxby5qcGVnIn0"}',
    '{"clerkId": "user_2O2hWhvcrKbdes5yjYTtpbnHSac", "username": "borkbork", "firstName": "Tak", "lastName": "Oyaki", "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJPMmhXemhFTk04NUxsNmZBbDZBWUhaYloxby5qcGVnIn0"}',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}',
    '{"provider": "clerk", "providers": ["clerk"]}',
    'authenticated',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'cspur43@gmail.com',
    NOW(),
    '{"clerkId": "user_2NzXQTqLosAtfnknSdulnif3rR3", "username": "colton", "firstName": "Colton", "lastName": null, "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTnpYUWpKa3hEMGVNOUlsMFV1YXp3eldyR3guanBlZyJ9"}',
    '{"clerkId": "user_2NzXQTqLosAtfnknSdulnif3rR3", "username": "colton", "firstName": "Colton", "lastName": null, "avatar_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTnpYUWpKa3hEMGVNOUlsMFV1YXp3eldyR3guanBlZyJ9"}',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}',
    '{"provider": "clerk", "providers": ["clerk"]}',
    'authenticated',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  )
RETURNING id, email;

-- Step 2: Create profiles for each user
-- Uses the email to match users and create their profile records
INSERT INTO "Profile" ("userId", username, "firstName", "lastName", "imageUrl", "createdAt", "updatedAt")
SELECT 
  id,
  user_metadata->>'username',
  user_metadata->>'firstName',
  NULLIF(user_metadata->>'lastName', 'null'),
  user_metadata->>'avatar_url',
  NOW(),
  NOW()
FROM auth.users
WHERE email IN ('khing@pm.me', 'carolynspurgin@gmail.com', 'vsongsang@live.com', 'cspur43@gmail.com')
ON CONFLICT ("userId") DO UPDATE SET
  "updatedAt" = NOW();

-- Verify results
SELECT 'Auth Users Created:' as "Result";
SELECT COUNT(*) as count FROM auth.users WHERE email IN ('khing@pm.me', 'carolynspurgin@gmail.com', 'vsongsang@live.com', 'cspur43@gmail.com');

SELECT 'Profiles Created:' as "Result";
SELECT COUNT(*) as count FROM "Profile" WHERE username IN ('kh1ng', 'dogmom43', 'borkbork', 'colton');
