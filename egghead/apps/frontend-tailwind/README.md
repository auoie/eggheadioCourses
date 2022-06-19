# Notes

- https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/. This is how to add pagination.
- [This](https://davidyeiser.com/work/givapp-design-system) is an example of a beautiful design.

```bash
npx create-next-app@latest --ts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D @tailwindcss/typography
npm install clsx
npm i next-mdx-remote
npm install zustand
npm install next-images
```

For styling, [this link](https://www.tailwind-kit.com/templates/dashboard) was a helpful reference.

## Todo

- [ ] Add syntax highlighting to code blocks.
- [ ] When I change my page using the bottom pagination component while on iOS, sometimes it jumps.
      I think this is because the new page is longer in length.
      iOS might be using a naive absolute position relative to the top-left corner rather than keeping the user at the bottom.
      I should fix it so that the user stays at the bottom when clicking that pagination link.
