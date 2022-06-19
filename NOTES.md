# Notes

## Converting to Nx

```bash
# .
npm install -D tailwindcss postcss autoprefixer zod

# apps/frontend-tailwind
cd apps/frontend-tailwind
npx tailwindcss init -p

npm install clsx next-images next-mdx-remote zustand @tailwindcss/typography
npm install @nrwl/node
npm install axios node-html-parser
npx nx generate @nrwl/node:library egghead-courses --buildable --no-publishable --strict --testEnvironment=node

# https://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux
find . -maxdepth 1 -exec mv {} .. \;

# .
npx nx format:check --all
```

I tried to use the node library version that uses `swc`, but I kept getting an error that says I need an `.swcrc` file.
I don't know how to make that, so I'm not going to do that.

## Running a Fetcher Script

```bash
npx nx run fetch-courses:build && node dist/apps/fetch-courses/main.js > test.json
time node dist/apps/fetch-courses/main.js > test.json # timing it
```

## Nx Cloud

Nx Cloud automatically puts a Read-Write key in `nx.json`.
If the repository is public, that is bad.
I made a read-only key and put it in `nx.json`.
I put my read-write key in `.env.local` with the format

```text
NX_CLOUD_ACCESS_TOKEN="stuff"
```

Then I can access it with `source .env.local`.

# Todo

- [ ] Get `nx run frontend-tailwind:build` to work.
