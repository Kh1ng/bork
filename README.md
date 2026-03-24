# [Bork!](https://bork.coltonspurgin.tech/)

Bork is a social media app for dog people. Just a Twitter clone with more dogs, entirely for learning purposes.

## Tech I used
- Typescript
- SQL
- tRPC
- Vercel
- Supabase Auth
- Supabase PostgreSQL
- GitHub Actions
- Jest

## What I've Learned
Besides the normal minor refactors and updates, a big hurdle was that Planet-scale decided to shut down its free tier. I migrated through Railway and eventually moved auth/database to Supabase, which taught me a lot about data migration and auth flows. This included removal of prisma and migrating to Supabase's api. I also am feeling really good about CI & CD through GitHub actions.

## The To-Do List
- I'd like to get random pictures of dogs from a free API and assign them to new users.
- More testing in-depth testing, 100% coverage.





Supabase local/admin notes:
```bash
# Public API endpoint (app runtime)
https://bork-sb.coltonspurgin.tech

# Admin/studio should stay on LAN/private address
# Example: http://192.168.5.159:54323
```
