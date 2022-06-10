# Egghead IO Free

## Bot

## Egghead

```bash
npx create-next-app@latest --ts egghead
```

## Notes

I don't remember what the `./docker/` folder is for.
The folder `./egghead/` is a draft of the frontend using Chakra UI.
Basically, this application uses `bot` to fetch the contents of `https://egghead.io/courses` and then renders it with `frontend-tailwind`.

It gets the output json with

```bash
npx ts-node --transpile-only src/index.ts > output/cleanCourses.json
```

The Next.js project in `./frontend-tailwind/` reads the content in `./bot/output/cleanCourses.json` at build time and then exports the results to a static folder.
This is done with

```bash
npm run build && npx next export
```

The result is just static html, css, and javascript.
Then we I `rsync` to send the results to my remote file server.

```bash
rsync -avh --delete out/  <remote-user>@<remote-ip-address>:<remote-path>
```

This process is automated on a push to the main branch of my remote GitHub
with GitHub actions with the file `./.github/workflows/deploy.yml`.

## Bug

When I run the stuff below on my machine, my website does not emit any errors emitted in the console.

```bash
npm run build && npx next export
rsync -avh --delete out/  <remote-user>@<remote-ip-address>:<remote-path>
```

But with GitHub actions, I get a bunch of errors including https://reactjs.org/docs/error-decoder.html/?invariant=425.
I get one error for each course card.
I don't know why this is happening.
