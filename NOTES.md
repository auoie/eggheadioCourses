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
npm install write
npm install @types/write

# https://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux
find . -maxdepth 1 -exec mv {} .. \;

# .
npx nx format:check --all

# ./apps/frontend-tailwind
npm install next-themes
npm install @headlessui/react
npm install rehype-pretty-code shiki
npm install react-div-100vh
```

I tried to use the node library version that uses `swc`, but I kept getting an error that says I need an `.swcrc` file.
I don't know how to make that, so I'm not going to do that.

## Running a Fetcher Script and Building the Website

Doing it manually, we can do the following:

```bash
npx nx run fetch-courses:build && node dist/apps/fetch-courses/main.js > test.json
time node dist/apps/fetch-courses/main.js > test.json # timing it

time npx nx run fetch-courses:build
time node dist/apps/fetch-courses/main.js
time npx nx run frontend-tailwind:export
```

To export, we do the following.
Because export isn't cached, this will fetch the courses every time.

```bash
npx nx run frontend-tailwind:export
```

To build, we do the following.
Note that because of caching,
if we build again, it won't fetch the courses again.
Also, if I run `npx nx run frontend-tailwind:build` and then `npx nx run frontend-tailwind:serve` and then `npx nx run frontend-tailwind:build` and then `npx nx run frontend-tailwind:serve:production`,
the build won't show up because the cache assumes it's already there and because the serve command overwrote the build result.
As a workaround, use `npx nx reset` or rename the `build` command to something else so that it's not cached by `nx`.
Caching is confusing to me.

```bash
npx nx run frontend-tailwind:build
```

To develop, we do

```bash
npx nx run fetch-courses:export
npx nx run frontend-tailwind:serve
```

## useTheme

I'm getting a warning `Warning: Text content did not match. Server: "loading" Client: "light"`
because I'm using `useTheme` without `useEffect` to check if I'm mounted.
This is fine because I'm not going to do any serverside rendering.
That being said, I still don't like the warning.
It can be avoided by using `useIsomorphicLayoutEffect`.

## Nx Cloud

Nx Cloud automatically puts a Read-Write key in `nx.json`.
If the repository is public, that is bad.
I made a read-only key and put it in `nx.json`.
I put my read-write key in `.env.local` with the format

```text
NX_CLOUD_ACCESS_TOKEN="stuff"
```

Then I can access it with `source .env.local`.

## Components

- Badge is based on Chakra UI.
- Navbar blur is taken from nextra-docs-theme.
- Pagination Algorithm Taken from online. Pagination taken from geist-ui.
- ThemeSwitch taken from next-themes and nextra-docs-theme.
- Icons taken from https://feathericons.com/.
- Styling taken from nextra.

## Theme Switch

The theme switch button is based on theme-switch button in nextra-theme-docs.
Also see geist for more ideas.

## Pagination

The pagination component is based on geist pagination.
Also see https://vercel.com/design for how to make a good button
https://nextjs.org/learn/basics/create-nextjs-app
for how to make responsive numbered buttons.

## Prose CSS and Syntax Highlighting

To setup syntax highlighting, we need to use `rehype-pretty-code` which uses the `shiki` syntax highlighter.
In order to setup dark and light mode switching, we'll need to use [theme with CSS variables](https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables).
This comes from the `nextra` GitHub package.

In order to setup custom CSS styles for markdown prose content, `nextra-theme-docs` and `nextra-theme-blog`.
I also took the `--shiki` color variables from those sources.
In order to add SCSS style nesting, I had to use [this documentation](https://tailwindcss.com/docs/using-with-preprocessors#nesting).
Basically add the line `'tailwindcss/nesting': {}` to `postcss.config.js`.
Then I could manually override the prose settings in my `globals.css` file using tailwind `@apply` directives.
For guidance, I looked at the nextra docs and blog themes.
For example, I removed the backticks from the code snippets and gave a gave them a rounded background instead.

## Fonts

Note that for google fonts, if you put the link in the `_document.tsx` header,
then [Next.js](https://nextjs.org/blog/next-10-2#automatic-webfont-optimization) will automatically inline it.
You should do this.
Though, I'm using custom fonts so I'm not doing that.
Actually, it's probably a good idea to use an open source font.
See [here](https://news.ycombinator.com/item?id=28009042) for some font recommendations.

## Docker

Locally, I can use:

```bash
# Building and running locally
docker build -f ./docker/Dockerfile -t eggheadio-courses:latest .
docker run --rm -it \
      -v $PWD/output/:/app/output \
      --name eggheadio-courses \
      eggheadio-courses

# Running on remote VPS run on remote VPS
git clone https://github.com/auoie/eggheadioCourses.git
sudo DOCKER_BUILDKIT=1 docker build -f ./docker/Dockerfile -t eggheadio-courses:latest .
sudo docker run -d \
--restart always \
-v /path/to/folder/:/app/output/ \
--name eggheadio-courses \
eggheadio-courses
```

# Todo

- [x] Make a nice looking select component based on `nextra-docs-theme`. E.g., add exit transition.
- [x] Passing components to MDXProvider (specificially make link refer to external thing).
      Make the about page use this provider.
- [x] Make navbar occupy full width when phone is in horizontal mode.
      Actually, I'll call that a feature rather than a bug.
      If I did this, I would need knowledge of the size of the iphone wedge
      in order to make the content not be covered by it.
      Encoding device specific values into the frontend doesn't seem like a good
      long-term move.
- [ ] Add hamburger transition thing for small screens. Actually, made it look like the one [here](https://createwithflow.com/).
- [ ] There is some repetition between ThemeSwitch and LabelSelect.
      There is some repetition between course card mdx and about page mdx.
- [ ] Figure out how to transition between adjacent pagination buttons based on Geist tabs.
- [ ] Adding nice looking search component
- [ ] Preserve state when navigating to about page
- [ ] Remove flash of black on refresh in light mode
