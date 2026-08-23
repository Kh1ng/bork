import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

/** @type {Record<string, string>} */
const legacyAuthorMap = {
  user_2O2hWhvcrKbdes5yjYTtpbnHSac: "6d3c3d83-572a-4b83-a95b-e79f08c9ec63",
  user_2NzXQTqLosAtfnknSdulnif3rR3: "2a1c9af0-8632-40f0-9fd5-10c4a9889e93",
  user_2OP4aJqfJOLSfoVjMRVBJLhrC7y: "4e140f2b-f8bf-4f2f-8f59-cf27e4ca4ab9",
  user_2iNN5e1ji2SEShOsCgRARwYJLQt: "9f4a2d2a-c2c5-4ad2-8c80-44b7012f9a11",
};

const dumpPath = resolve(
  process.cwd(),
  "ripPlanetScale/pscale_dump_borkdb_main_20240317_065037/borkdb.Post.00001.sql",
);

const sql = readFileSync(dumpPath, "utf8");

// Matches tuples like:
// ("id","createdAt","content","authorID")
const tupleRegex = /\("([^"]+)","([^"]+)","((?:\\.|[^"])*)","([^"]+)"\)/g;

const posts = [];
let match;
while ((match = tupleRegex.exec(sql)) !== null) {
  const [, id, createdAtRaw, contentRaw, authorIDRaw] = match;
  if (!id || !createdAtRaw || !contentRaw || !authorIDRaw) {
    continue;
  }

  const content = contentRaw.replaceAll("\\'", "'");
  const mappedAuthorId = legacyAuthorMap[authorIDRaw] ?? authorIDRaw;

  posts.push({
    id,
    createdAt: new Date(createdAtRaw).toISOString(),
    content,
    authorID: mappedAuthorId,
  });
}

if (posts.length === 0) {
  console.error("No legacy posts parsed from dump file.");
  process.exit(1);
}

const url = new URL(`${SUPABASE_URL}/rest/v1/Post`);
url.searchParams.set("on_conflict", "id");

const response = await fetch(url.toString(), {
  method: "POST",
  headers: {
    apikey: SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(posts),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`Import failed: ${response.status} ${text}`);
  process.exit(1);
}

const inserted = await response.json();
console.log(`Imported/upserted ${inserted.length} legacy posts.`);

const countResp = await fetch(`${SUPABASE_URL}/rest/v1/Post?select=id`, {
  headers: {
    apikey: SERVICE_ROLE_KEY,
  },
});

if (!countResp.ok) {
  const text = await countResp.text();
  console.error(`Count check failed: ${countResp.status} ${text}`);
  process.exit(1);
}

const all = await countResp.json();
console.log(`Total posts now: ${all.length}`);
