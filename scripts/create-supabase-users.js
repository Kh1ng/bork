#!/usr/bin/env node

/**
 * Create Supabase auth users from exported Clerk data
 * Usage: node scripts/create-supabase-users.js
 * 
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) are required');
  process.exit(1);
}

const clerkUsersPath = path.join(process.cwd(), 'clerk-users.json');
if (!fs.existsSync(clerkUsersPath)) {
  console.error('❌ clerk-users.json not found. Run: CLERK_API_KEY=xxx node scripts/clerk-export.js');
  process.exit(1);
}

async function createSupabaseUser(email, metadata) {
  const url = new URL(SUPABASE_URL);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: '/auth/v1/admin/users',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const payload = {
      email,
      password: Math.random().toString(36).slice(-16), // Random temp password
      user_metadata: metadata,
      autoconfirm: true,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if ([200, 201].includes(res.statusCode)) {
          resolve(JSON.parse(data));
        } else {
          // If user already exists, try to get their data
          if (res.statusCode === 422) {
            resolve({ email, id: 'existing', status: 'already_exists' });
          } else {
            reject(new Error(`Supabase API error: ${res.statusCode} ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function main() {
  try {
    const clerkUsers = JSON.parse(fs.readFileSync(clerkUsersPath, 'utf-8'));
    console.log(`📥 Loaded ${clerkUsers.length} Clerk users`);

    const mapping = {};
    const results = [];

    for (let i = 0; i < clerkUsers.length; i++) {
      const user = clerkUsers[i];
      const { clerkId, email, firstName, lastName, imageUrl, username } = user;

      try {
        const supabaseUser = await createSupabaseUser(email, {
          username,
          firstName,
          lastName,
          avatar_url: imageUrl,
        });

        if (supabaseUser.id && supabaseUser.id !== 'existing') {
          mapping[clerkId] = supabaseUser.id;
          results.push({
            email,
            clerkId,
            supabaseId: supabaseUser.id,
            status: 'created',
          });
          console.log(`✅ Created user: ${email} → ${supabaseUser.id.substring(0, 8)}...`);
        } else {
          results.push({
            email,
            clerkId,
            status: supabaseUser.status || 'unknown',
          });
          console.log(`⚠️  User already exists: ${email}`);
        }
      } catch (error) {
        results.push({
          email,
          clerkId,
          status: 'error',
          error: error.message,
        });
        console.error(`❌ Failed to create user ${email}: ${error.message}`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    fs.writeFileSync(
      'clerk-to-supabase-mapping.json',
      JSON.stringify(mapping, null, 2),
    );

    fs.writeFileSync(
      'migration-results.json',
      JSON.stringify(results, null, 2),
    );

    console.log(`\n✅ Migration complete`);
    console.log(`   Created/processed: ${results.length} users`);
    console.log(`   Mapping saved: clerk-to-supabase-mapping.json`);
    console.log(`   Results saved: migration-results.json`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
