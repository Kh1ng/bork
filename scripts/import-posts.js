#!/usr/bin/env node

/**
 * Import Railway posts into Supabase with user ID mapping
 * 
 * Usage:
 * 1. Export posts from Railway: mysql -u user -p database -e "SELECT * FROM Post;" > posts.csv
 * 2. Run: node scripts/import-posts.js clerk-to-supabase-mapping.json posts.csv
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
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const mappingFile = process.argv[2];
const postsFile = process.argv[3];

if (!mappingFile || !postsFile) {
  console.error('Usage: node scripts/import-posts.js <mapping.json> <posts.csv>');
  process.exit(1);
}

if (!fs.existsSync(mappingFile)) {
  console.error(`❌ Mapping file not found: ${mappingFile}`);
  process.exit(1);
}

if (!fs.existsSync(postsFile)) {
  console.error(`❌ Posts file not found: ${postsFile}`);
  process.exit(1);
}

async function insertPosts(posts) {
  const url = new URL(SUPABASE_URL);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/Post',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'return=minimal',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if ([200, 201].includes(res.statusCode)) {
          resolve({ success: true, count: posts.length });
        } else {
          reject(new Error(`Supabase API error: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(posts));
    req.end();
  });
}

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 1) return [];

  // Parse header
  const header = lines[0].split(',').map(h => h.trim());
  const posts = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = line.split(',');
    const post = {};
    header.forEach((col, idx) => {
      post[col] = values[idx]?.trim() || null;
    });
    posts.push(post);
  }

  return posts;
}

function parseJSON(jsonContent) {
  return JSON.parse(jsonContent);
}

async function main() {
  try {
    console.log('📥 Loading mapping and posts...');
    const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
    const postsContent = fs.readFileSync(postsFile, 'utf-8');

    let posts = [];
    if (postsFile.endsWith('.csv')) {
      posts = parseCSV(postsContent);
    } else if (postsFile.endsWith('.json')) {
      posts = parseJSON(postsContent);
    } else {
      throw new Error('Posts file must be CSV or JSON');
    }

    console.log(`📥 Loaded ${posts.length} posts from Railway`);

    // Map Clerk IDs to Supabase IDs
    const mappedPosts = posts
      .map((post) => {
        const clerkId = post.authorID;
        const supabaseId = mapping[clerkId];

        if (!supabaseId) {
          console.warn(`⚠️  Post ${post.id}: author Clerk ID not found in mapping (${clerkId})`);
          return null;
        }

        return {
          id: post.id,
          content: post.content,
          authorID: supabaseId, // Replace Clerk ID with Supabase ID
          createdAt: post.createdAt,
        };
      })
      .filter(p => p !== null);

    console.log(`✅ Mapped ${mappedPosts.length} posts to Supabase user IDs`);

    if (mappedPosts.length === 0) {
      console.warn('⚠️  No posts to import');
      return;
    }

    // Import in batches
    const BATCH_SIZE = 100;
    let imported = 0;

    for (let i = 0; i < mappedPosts.length; i += BATCH_SIZE) {
      const batch = mappedPosts.slice(i, Math.min(i + BATCH_SIZE, mappedPosts.length));
      try {
        await insertPosts(batch);
        imported += batch.length;
        console.log(`✅ Imported ${imported}/${mappedPosts.length} posts`);
      } catch (error) {
        console.error(`❌ Batch import failed: ${error.message}`);
        // Continue with next batch
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Import complete: ${imported} posts added to Supabase`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
