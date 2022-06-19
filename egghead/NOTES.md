# Notes

## Converting to Nx

```bash
npm install -D tailwindcss postcss autoprefixer

# apps/frontend-tailwind
cd apps/frontend-tailwind
npx tailwindcss init -p

npm install clsx next-images next-mdx-remote zustand @tailwindcss/typography
npm install @nrwl/node
npm install axios node-html-parser
npx nx generate @nrwl/node:library egghead-courses --buildable --compiler=swc --no-publishable --strict --testEnvironment=node
```