-- Supabase PostgreSQL Schema for Bork
-- Run this in Supabase SQL Editor to create tables

-- Post table
CREATE TABLE IF NOT EXISTS "Post" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  content VARCHAR(255) NOT NULL,
  "authorID" TEXT NOT NULL,
  CONSTRAINT post_author_idx UNIQUE ("authorID", id)
);

-- Profile table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS "Post_authorID_idx" ON "Post"("authorID");
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");
CREATE INDEX IF NOT EXISTS "Profile_username_idx" ON "Profile"(username);
