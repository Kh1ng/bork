import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// User data from migration CSV
const USERS = [
  {
    id: "9f4a2d2a-c2c5-4ad2-8c80-44b7012f9a11",
    username: "kh1ng",
    firstName: "Colton",
    lastName: "Spurgin",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaU5ONWRhajNtUHlNRkMxd3VRWThhcnZOR1AifQ",
  },
  {
    id: "4e140f2b-f8bf-4f2f-8f59-cf27e4ca4ab9",
    username: "dogmom43",
    firstName: "Carolyn",
    lastName: "Spurgin",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yT1A0YUl4QXZ6RzVwcU9uZ1lGbEtmb1ppNVguanBlZyJ9",
  },
  {
    id: "6d3c3d83-572a-4b83-a95b-e79f08c9ec63",
    username: "borkbork",
    firstName: "Tak",
    lastName: "Oyaki",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJPMmhXemhFTk04NUxsNmZBbDZBWUhaYloxby5qcGVnIn0",
  },
  {
    id: "2a1c9af0-8632-40f0-9fd5-10c4a9889e93",
    username: "colton",
    firstName: "Colton",
    lastName: null,
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTnpYUWpKa3hEMGVNOUlsMFV1YXp3eldyR3guanBlZyJ9",
  },
];

const TEST_POSTS = [
  {
    authorID: "9f4a2d2a-c2c5-4ad2-8c80-44b7012f9a11",
    content: "Just migrated to Supabase! 🎉",
  },
  {
    authorID: "4e140f2b-f8bf-4f2f-8f59-cf27e4ca4ab9",
    content: "Testing the new setup",
  },
  {
    authorID: "6d3c3d83-572a-4b83-a95b-e79f08c9ec63",
    content: "My first post here!",
  },
];

async function migrate() {
  try {
    console.log("🔧 Starting migration...");

    // Step 1: Upsert profiles
    console.log("👤 Populating Profile table...");
    const { error: profileError } = await supabase
      .from("Profile")
      .upsert(
        USERS.map((u) => ({
          userId: u.id,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          imageUrl: u.imageUrl,
        })),
        { onConflict: "userId" }
      );

    if (profileError) {
      console.error("❌ Profile insert failed:", profileError);
      throw profileError;
    }
    console.log("✅ Profile table populated");

    // Step 2: Create test posts
    console.log("📝 Creating test posts...");
    const { error: postError } = await supabase
      .from("Post")
      .insert(TEST_POSTS);

    if (postError) {
      console.error("❌ Post insert failed:", postError);
      throw postError;
    }
    console.log("✅ Test posts created");

    // Step 3: Verify data
    console.log("🔍 Verifying migration...");
    const { data: profiles, error: profileFetchError } = await supabase
      .from("Profile")
      .select("*");

    if (profileFetchError) {
      console.error("❌ Profile fetch failed:", profileFetchError);
      throw profileFetchError;
    }

    const { data: posts, error: postFetchError } = await supabase
      .from("Post")
      .select("*");

    if (postFetchError) {
      console.error("❌ Post fetch failed:", postFetchError);
      throw postFetchError;
    }

    console.log(`✅ Migration complete!`);
    console.log(`   - ${profiles?.length || 0} profiles`);
    console.log(`   - ${posts?.length || 0} posts`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
