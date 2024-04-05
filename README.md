This is code for the following tutorial:

![Fiverr Clone](https://github.com/vukrosic/next14-fiverr/blob/main/public/thumbnail.png?raw=true)

[VIDEO TUTORIAL](https://youtu.be/UK5SI3lU3X8)


If you want to run this I recommend following the tutorial. You can also try the following:

## Required:
Node version 14.x

## Clone this repo
```bash
git clone https://github.com/vukrosic/next14-fiverr
```

## Install packages
```bash
cd next14-fiverr & npm install
```

## Run Convex
```bash
npx convex dev
```

You will need to setup Clerk, Convex and other things. Don't forget to add your variables to convex website as well. Here is example .env.local file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_HOSTING_URL=

NEXT_STRIPE_PUBLISHABLE_KEY=
NEXT_STRIPE_SECRET_KEY=
```

## Run the app
```bash
npm run dev
```

At this point, you application should work, but it probably doesn't. You may check timesteps in the video description or try to read and solve errors by yourself. You can also ask in comments.




# Next JS documentation below

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
