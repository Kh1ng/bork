#!/bin/bash

echo "🐕 Bork - Railway to Supabase Migration Setup"
echo "=============================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.template .env.local
    echo "✅ .env.local created. Please fill in your Supabase credentials."
    echo ""
    echo "You need to add:"
    echo "- DATABASE_URL (your Supabase PostgreSQL connection string - pooled)"
    echo "- DIRECT_URL (your Supabase PostgreSQL connection string - direct)"
    echo "- NEXT_PUBLIC_SUPABASE_URL (your Supabase project URL)"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY (your Supabase anonymous key)"
    echo ""
else
    echo "⚠️  .env.local already exists. Please make sure it has the required Supabase variables."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

echo ""
echo "🔧 Next steps:"
echo "1. Fill in your .env.local file with Supabase credentials"
echo "2. Run 'npx prisma db push' to set up your Supabase PostgreSQL schema"
echo "3. Configure authentication providers in your Supabase dashboard"
echo "4. Export your data from Railway MySQL (see scripts/migration-data/README.md)"
echo "5. Create user mapping from Clerk IDs to Supabase IDs"
echo "6. Run 'node scripts/migrate-data.js' to migrate your data"
echo "7. Run 'npm run dev' to start the development server"
echo ""
echo "📖 See MIGRATION.md for detailed setup instructions"
