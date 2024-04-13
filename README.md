# [Bork!](https://bork.coltonspurgin.tech/)

Bork is a social media app for dog people. Just a Twitter clone with more dogs, entirely for learning purposes.

## Stuff I used
- Typescript
- SQL
- tRPC
- Vercel
- Clerk

## Stuff I did
Made the app and about a year later planet-scale decided to shut down their free tier. I ended up migrating to Railway and learning a lot about databases.

## Stuff I plan to do
- Clerk has changed how the user objects work, I need to update profile images and I'd like to add a user settings interface for a user to access their settings.
- I'd like to get random pictures of dogs from a free api and assign them to new users.
- Testing, I'm not sure if I'm way out in left field or what but it is kind of ridiculous to mock components in this stack. I would still like to add some testing in CI/CD.





Prisma stuff I forget a lot:
```bash
#start dev db
npx prisma generate

# To manage DB (optional)
npx prisma studio
```
