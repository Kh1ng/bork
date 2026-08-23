#!/bin/bash

set -e

# Load environment
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found"
  exit 1
fi

set -a && source .env.local && set +a

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set"
  exit 1
fi

echo "🔧 Starting migration..."
echo "URL: $NEXT_PUBLIC_SUPABASE_URL"

# Step 1: Populate Profile table
echo "👤 Populating Profile table..."

USERS=(
  '{"userId":"9f4a2d2a-c2c5-4ad2-8c80-44b7012f9a11","username":"kh1ng","firstName":"Colton","lastName":"Spurgin","imageUrl":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaU5ONWRhajNtUHlNRkMxd3VRWThhcnZOR1AifQ"}'
  '{"userId":"4e140f2b-f8bf-4f2f-8f59-cf27e4ca4ab9","username":"dogmom43","firstName":"Carolyn","lastName":"Spurgin","imageUrl":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yT1A0YUl4QXZ6RzVwcU9uZ1lGbEtmb1ppNVguanBlZyJ9"}'
  '{"userId":"6d3c3d83-572a-4b83-a95b-e79f08c9ec63","username":"borkbork","firstName":"Tak","lastName":"Oyaki","imageUrl":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZmFjZWJvb2svaW1nXzJPMmhXemhFTk04NUxsNmZBbDZBWUhaYloxby5qcGVnIn0"}'
  '{"userId":"2a1c9af0-8632-40f0-9fd5-10c4a9889e93","username":"colton","firstName":"Colton","lastName":null,"imageUrl":"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTnpYUWpKa3hEMGVNOUlsMFV1YXp3eldyR3guanBlZyJ9"}'
)

for USER in "${USERS[@]}"; do
  curl -s -X POST \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/Profile" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates" \
    -d "$USER" > /dev/null 2>&1
done

echo "✅ Profile table populated"

# Step 2: Create test posts
echo "📝 Creating test posts..."

POSTS=(
  '{"authorID":"9f4a2d2a-c2c5-4ad2-8c80-44b7012f9a11","content":"Just migrated to Supabase! 🎉"}'
  '{"authorID":"4e140f2b-f8bf-4f2f-8f59-cf27e4ca4ab9","content":"Testing the new setup"}'
  '{"authorID":"6d3c3d83-572a-4b83-a95b-e79f08c9ec63","content":"My first post here!"}'
)

for POST in "${POSTS[@]}"; do
  curl -s -X POST \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/Post" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "$POST" > /dev/null 2>&1
done

echo "✅ Test posts created"

# Step 3: Verify
echo "🔍 Verifying migration..."
PROFILE_COUNT=$(curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/Profile?select=*" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" | jq 'length')

POST_COUNT=$(curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/Post?select=*" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" | jq 'length')

echo ""
echo "✨ Migration complete!"
echo "   - $PROFILE_COUNT profiles"
echo "   - $POST_COUNT posts"
echo ""
echo "Next steps:"
echo "  1. Restart dev server: npm run dev"
echo "  2. Navigate to http://localhost:3000"
